import { AppDataSource, ImagenesDataSource } from '@/database/datasources'
import { RazonSocial, RegistroPatronal } from '@/entities/empleados'
import { CalendarioNomina, Concepto, Imagen, Timbrado } from '@/entities/recibo'
import { toLocalDate } from '@/helpers/helpers'
import logger from '@/helpers/logger'
import { ConfiguracionRecibo, Recibo } from '@/interfaces/recibo.interface'
import { HTTPError } from '@/middlewares/error_handler'
import { TiemposService } from '@/modules/tiempos/services'

export class ReciboService {
  async findDatosRecibo (id_emp: number, id_periodo: number): Promise<Object> {
    const informacion = await AppDataSource.query(
      `
      SELECT 
      noempx, nombre, apPaterno, apMaterno, imss, fecha_alta, emp.id_emp,
      dp.rfc,
      dp.curp,
      tl.DESCR AS linea,
      td.DESCR as departamento,
      ta.DESAREA as area,
      tt.turno,
      th.horario,
      cn.Numero AS periodo,
      dp.sd,
      dp.sdi,
      dp.id_plaza,
      tb.DESCR as banco,
      tm.descripcion as medioPago,
      dp.cuenta,
      tp.DESCR as puesto,
      CONVERT(NVARCHAR(10),cn.fechaini,103) + ' al ' +  CONVERT(NVARCHAR(10),cn.fechafin,103) AS periodoPago
    FROM Empleados AS emp 
      INNER JOIN DatosPeriodo dp ON emp.id_emp = dp.id_emp -- Cuenta
      INNER JOIN TLineas tl ON tl.id_lineas = dp.id_linea -- DESCR
      INNER JOIN TDepartamentos td ON td.Id_Departamentos = dp.id_departamento -- DESCR
      INNER JOIN TAreas ta ON ta.Id_Areas = dp.id_areas -- DESAREA
      INNER JOIN TTurnos tt ON tt.Id_Turno = dp.id_turno -- Tturno
      INNER JOIN THorarios th ON th.id_horario = dp.id_horario -- THorarios
      INNER JOIN TMedioPago tm ON tm.id_MedioPago = dp.id_mediopago -- TMedioPago
      INNER JOIN CalenNomina cn ON cn.id_periodo = dp.id_periodo -- Numero de tabla
      INNER JOIN TBancos tb ON tb.Id_Banco = dp.id_banco -- DESCR
      INNER JOIN TPuestos tp ON tp.Id_Puestos = dp.id_puesto -- DESCR
      WHERE dp.id_emp = @0 AND dp.id_periodo = @1
      `, [id_emp, id_periodo]
    )

    return informacion
  }

  async findEmpresa (): Promise<any> {
    const empresa = await RazonSocial.createQueryBuilder('configRs')
      .select([
        'configRs.id_razonsocial',
        'configRs.razonSocial',
        'configRs.rfc',
        'configRs.id_imagen',
        'configRs.domicilio',
        'configRs.colonia',
        'configRs.codigoPostal',
        'configRs.ciudad',
        'configRs.estado'
      ])
      .where('ConfigRs.cadenacias LIKE :cadena', { cadena: '%1,%' })
      .getMany()

    return empresa
  }

  async findPercepciones (id_emp: number, id_periodo: number): Promise<any> {
    const percepciones = await CalendarioNomina.query(`
    SELECT pagos.id_concepto AS clave, MAX(C.descripcion) AS concepto, SUM(pagos.Horas) AS horas, SUM(pagos.Pesos) AS pesos, SUM(pagos.PesosExcento) AS excento, SUM(pagos.Pesos+pagos.PesosExcento) AS total, C.Totaliza AS totaliza
      FROM ( 
        SELECT Id_Emp, Id_Periodo, id_concepto, Horas, Pesos, PesosExcento FROM nom_histpagos
        WHERE 
          id_emp IN (@0) AND id_periodo IN (@1) AND
          id_concepto in (SELECT id_concepto FROM conceptos WHERE tipoEnComparativo = 1 and en_recibo = 1)
          union
        SELECT Id_Emp, Id_Periodo, id_concepto, Horas, Pesos, PesosExcento FROM histpagos
        WHERE 
          id_emp IN (@0) AND id_periodo IN (@1) AND
          id_concepto in (SELECT id_concepto FROM conceptos WHERE tipoEnComparativo = 1 and en_recibo = 1)
        ) AS pagos 
      INNER JOIN conceptos C ON C.id_concepto=pagos.id_concepto
      AND C.tipoEnComparativo = 1 AND C.en_recibo = 1 WHERE id_periodo IN (@1)
      GROUP BY pagos.id_concepto, C.totaliza  order by pagos.id_Concepto
    `, [id_emp, id_periodo])

    return percepciones
  }

  async findDeducciones (id_emp: number, id_periodo: number): Promise<Object[]> {
    const deducciones = await CalendarioNomina.query(`
    SELECT NHP.id_concepto, NHP.horas, C.descripcion, '0' AS cantidad, CONVERT(varchar(12), CONVERT(money, (CASE WHEN NHP.consecutivo > 0 
      THEN (SELECT saldoactual FROM deducsfijas WHERE id_emp = NHP.id_emp AND id_concepto = NHP.id_concepto AND id_prestamo = NHP.consecutivo)
        ELSE (SELECT saldoactual FROM deducsfijas DF WHERE DF.id_emp = NHP.id_emp AND DF.id_concepto = NHP.id_concepto AND DF.fechApl = 
        (SELECT MAX(FechApl) FROM deducsfijas WHERE id_emp = DF.id_emp AND id_concepto = DF.id_concepto AND status = 'A'))
        END) - (NHP.pesos + NHP.pesosExcento)), 1) AS saldoAnterior, CONVERT(varchar(12), CONVERT(money, NHP.pesos + NHP.pesosExcento), 1) AS importe,
      CASE 
        WHEN NHP.consecutivo > 0 THEN ( SELECT CONVERT(varchar(12), CONVERT(money, saldoactual), 1) AS saldoactual FROM deducsfijas 
          WHERE id_emp = NHP.id_emp AND id_concepto = NHP.id_concepto AND id_prestamo = NHP.consecutivo)
        ELSE (SELECT CONVERT(varchar(12), CONVERT(money, saldoactual), 1) AS saldoactual FROM deducsfijas DF 
        WHERE DF.id_emp = NHP.id_emp AND DF.id_concepto = NHP.id_concepto AND DF.fechApl = 
          (SELECT MAX(FechApl) FROM deducsfijas WHERE id_emp = DF.id_emp AND id_concepto = DF.id_concepto AND status = 'A'))
        END AS saldoActual, NHP.pesos, NHP.pesosExcento FROM nom_histpagos NHP INNER JOIN conceptos C ON C.id_concepto = NHP.id_concepto
        WHERE NHP.id_periodo = @1 AND NHP.id_emp = @0 AND NHP.id_concepto IN (SELECT id_concepto FROM conceptos WHERE tipoEnComparativo = 2 AND en_recibo = 1)
        UNION ALL
        SELECT NHP.id_concepto, NHP.horas, C.descripcion, '0' AS cantidad, CONVERT(varchar(12), CONVERT(money, (CASE WHEN NHP.consecutivo > 0 
        THEN (SELECT saldoactual FROM deducsfijas WHERE id_emp = NHP.id_emp AND id_concepto = NHP.id_concepto AND id_prestamo = NHP.consecutivo)
            ELSE (SELECT saldoactual FROM deducsfijas DF WHERE DF.id_emp = NHP.id_emp AND DF.id_concepto = NHP.id_concepto AND DF.fechApl = 
          (SELECT MAX(FechApl) FROM deducsfijas WHERE id_emp = DF.id_emp AND id_concepto = DF.id_concepto AND status = 'A'))
            END) - (NHP.pesos + NHP.pesosExcento)), 1) AS saldoAnterior, CONVERT(varchar(12), CONVERT(money, NHP.pesos + NHP.pesosExcento), 1) AS importe,
        CASE
                WHEN NHP.consecutivo > 0 
            THEN (SELECT CONVERT(varchar(12), CONVERT(money, saldoactual), 1) AS saldoactual FROM deducsfijas WHERE id_emp = NHP.id_emp AND id_concepto = NHP.id_concepto AND id_prestamo = NHP.consecutivo)
            ELSE (SELECT CONVERT(varchar(12), CONVERT(money, saldoactual), 1) AS saldoactual FROM deducsfijas DF WHERE DF.id_emp = NHP.id_emp AND DF.id_concepto = NHP.id_concepto AND DF.fechApl = 
              (SELECT MAX(FechApl) FROM deducsfijas WHERE id_emp = DF.id_emp AND id_concepto = DF.id_concepto AND status = 'A'))
          END AS saldoActual, NHP.pesos, NHP.pesosExcento FROM histpagos NHP INNER JOIN conceptos C ON C.id_concepto = NHP.id_concepto 
            WHERE NHP.id_periodo = @1 AND NHP.id_emp = @0 AND NHP.id_concepto IN (SELECT id_concepto FROM conceptos WHERE tipoEnComparativo = 2 AND en_recibo = 1);
    `, [id_emp, id_periodo])

    return deducciones
  }

  async findRegistroPatronal (): Promise<any> {
    const registro = await RegistroPatronal.find()

    return registro
  }

  async findVacaciones (id_emp: number, fecha_fin: string): Promise<any> {
    const vacaciones = await AppDataSource.query(
      `
      SELECT SUM(ISNULL(derecho,0))- SUM(ISNULL(pagado,0)) resultado FROM (
        SELECT SUM(dias) AS derecho, 0 AS pagado, id_emp
        FROM adminvacaciones
        INNER JOIN (
          SELECT id_periodo, fechaini
          FROM calennomina
          WHERE fechaini < @1
        ) AS periodos ON adminvacaciones.id_periodo = periodos.id_periodo
        WHERE tipomov = 'D' AND id_emp = @0
        GROUP BY id_emp
        UNION
        SELECT 0 AS derecho, SUM(dias) AS pagado, id_emp
        FROM adminvacaciones
        INNER JOIN (
          SELECT id_periodo, fechaini
          FROM calennomina
          WHERE fechaini < @1
        ) AS periodos ON adminvacaciones.id_periodo = periodos.id_periodo
        WHERE tipomov = 'P' AND id_emp = @0
        GROUP BY id_emp) resultado
      `, [id_emp, fecha_fin]
    )

    return vacaciones
  }

  async findYears (id_emp: number): Promise<Object> {
    const years = await CalendarioNomina.createQueryBuilder('calendario')
      .select(['calendario.año id'])
      .leftJoin('calendario.nominas', 'nomina')
      .where('nomina.id_emp = :id_emp', { id_emp })
      .groupBy('calendario.año')
      .orderBy('calendario.año', 'DESC')
      .getRawMany()

    return years
  }

  async findMeses (year: number, id_emp: number): Promise<Object[]> {
    const meses = await CalendarioNomina.query(`
    SELECT 
      CAST(YEAR(FechaFin) AS VARCHAR) + '-' + CAST(MONTH(FechaFin) AS VARCHAR) AS id_periodo,
      CAST(YEAR(FechaFin) AS VARCHAR) + ' - ' + MesEspanol AS mes,
      MONTH(FechaFin) AS numMes
    FROM calennomina 
    JOIN (
      VALUES
        (1, 'Enero'),
        (2, 'Febrero'),
        (3, 'Marzo'),
        (4, 'Abril'),
        (5, 'Mayo'),
        (6, 'Junio'),
        (7, 'Julio'),
        (8, 'Agosto'),
        (9, 'Septiembre'),
        (10, 'Octubre'),
        (11, 'Noviembre'),
        (12, 'Diciembre')
    ) AS Meses(numero, MesEspanol) ON MONTH(FechaFin) = Meses.numero
    WHERE autoservicio = 'true' AND YEAR(FechaFin) = @0 
      AND id_periodo IN (
        SELECT id_periodo FROM nom_histpagos WHERE id_emp = @1
        UNION ALL
        SELECT id_periodo FROM histpagos WHERE id_emp = @1
      )
    GROUP BY 
      YEAR(FechaFin), 
      MONTH(FechaFin),
      CAST(YEAR(FechaFin) AS VARCHAR) + '-' + CAST(MONTH(FechaFin) AS VARCHAR),
      CAST(YEAR(FechaFin) AS VARCHAR) + ' - ' + MesEspanol,
      MONTH(FechaFin)
    ORDER BY numMes
    `, [year, id_emp])

    return meses
  }

  async findPeriodos (id_emp: number, mes: number, year: number): Promise<Object[]> {
    const periodos = await CalendarioNomina.query(`
    SELECT DAY(GETDATE() - (cn.fechaActualizacion)) AS dif, cn.parcial, cn.fechaIni, 
      CAST(cn.id_periodo AS VARCHAR) + '-' + CAST(cn.id_cia AS VARCHAR) AS id_periodo, 
      CONCAT(CONVERT(VARCHAR(10), cn.FechaIni, 105), ' al ', CONVERT(VARCHAR(10), cn.FechaFin, 105), ' - ',
            CASE WHEN CONVERT(VARCHAR(10), cn.Parcial, 105) = 0 THEN 'N' ELSE CONCAT('P ', CONVERT(VARCHAR(10), cn.Parcial, 105)) END
            ) AS periodo 
      FROM CalenNomina cn
      WHERE cn.id_periodo IN (
      SELECT nhp.id_periodo 
      FROM Nom_histpagos nhp 
      WHERE nhp.id_emp = @0
      ) 
      AND cn.año = @1  
      AND YEAR(cn.fechafin) IN (@1, @1 + 1) 
      AND MONTH(cn.fechafin) IN (@2, @2)
      AND cn.autoservicio = 'true' 
      ORDER BY cn.FechaIni, cn.Parcial DESC
    `, [id_emp, year, mes])

    return periodos
  }

  async findImagenEmpresa (): Promise<Imagen | null> {
    const empresa = await this.findEmpresa()
    const id_imagen = empresa[0].id_imagen

    try {
      await ImagenesDataSource.initialize()
      const imagen = await Imagen.findOne({
        where: { id_campo: id_imagen }
      })

      return imagen
    } catch (error: any) {
      logger.error('Error al obtener la imagen de la empresa: ', error)
      throw new HTTPError(500, 'Error al obtener la imagen de la empresa')
    } finally {
      await ImagenesDataSource.destroy()
    }
  }

  // Datos del recibo
  async getInformacionRecibo (id_emp: number, id_periodo: number, fecha_inicio: string, fecha_fin: string): Promise<Recibo> {
    const tiempos = new TiemposService()
    const informacion = [
      this.findDatosRecibo(id_emp, id_periodo),
      this.findEmpresa(),
      this.findPercepciones(id_emp, id_periodo),
      this.findDeducciones(id_emp, id_periodo),
      this.findRegistroPatronal(),
      tiempos.findAll(id_emp, fecha_inicio, fecha_fin),
      this.findVacaciones(id_emp, fecha_fin)
    ]

    const result = await Promise.all(informacion)

    return {
      empleado: result[0],
      empresa: result[1],
      percepciones: result[2],
      deducciones: result[3],
      registroPatronal: result[4],
      tiempos: result[5],
      vacaciones: result[6]
    }
  }

  // Helpers
  async findConfiguracion (id_periodo: number): Promise<ConfiguracionRecibo> {
    const configuracion: ConfiguracionRecibo[] = await AppDataSource.query(
      `
      SELECT MostrarFdoAh AS fdoAhrcbo, ISNULL(MostrarFdoEmpresa, 0) AS fdoAhrcboEmpresa, ISNULL(PeriodoActualFA, 0) AS periodoActualFA
      FROM CalenNomina
      INNER JOIN tcia ON calennomina.id_cia = tcia.id_cia
      WHERE id_periodo = @0;
      `, [id_periodo]
    )

    return configuracion[0]
  }

  async findFechaInicioCorte (id_periodo: number): Promise<string> {
    const fecha_inicio: Array<{ inicio: string }> = await AppDataSource.query(
      `
      SELECT MAX (fechaCorte) inicio FROM CorteFondoAhorro cf INNER JOIN CalenNomina cn ON cf.id_cia = cn.id_cia
      WHERE fechaCorte <= fechaIni and id_periodo = @0 GROUP BY cf.id_cia;
      `, [id_periodo]
    )

    if (fecha_inicio.length === 0) return toLocalDate(new Date()).split('T')[0]

    return fecha_inicio[0].inicio
  }

  async findFechaFinCorte (id_periodo: number): Promise<string | undefined> {
    const fecha_fin: Array<{ fin: string }> = await AppDataSource.query(
      `
      SELECT ISNULL(MIN(fechaCorte), GETDATE()) fin FROM CorteFondoAhorro cf 
      INNER JOIN CalenNomina cn ON cf.id_cia = cn.id_cia
      WHERE fechaCorte >= fechaIni and id_periodo = @0 GROUP BY cf.id_cia;
      `, [id_periodo]
    )

    return fecha_fin[0].fin
  }

  async findAportacionEmpleado (id_emp: number, id_periodo: number, fecha_inicio: string, fecha_fin: string): Promise<any> {
    const configuracion = await this.findConfiguracion(id_periodo)

    let aportacion = []

    if (configuracion.periodoActualFA) {
      aportacion = await AppDataSource.query(
        `
        SELECT id_emp, Sum(aportempleado) + Sum(actualh) + Sum(actualn) AportEmpleado 
          FROM (SELECT a.id_emp, Sum(pesos)AportEmpleado,0 actualH,0 actualN 
          FROM  (SELECT e.id_emp, c.id_periodo FROM calennomina c, empleados e
          WHERE  c.fechafin >= e.fecha_alta AND e.id_emp IN ( @0 ))a 
          INNER JOIN(SELECT * FROM   nom_histpagos N WHERE  N.id_concepto 
          IN (SELECT fa_empleado FROM   configconceptos) AND id_periodo 
          IN (SELECT id_periodo FROM   calennomina c 
          WHERE c.fechaini <= @2  AND c.fechaini >= @3 AND c.fechafin <= 
          (SELECT fechaini FROM calennomina WHERE id_periodo = @1)
          -- Si es con el periodo actual agregar esto
            UNION 

            SELECT id_periodo FROM   calennomina c 
            INNER JOIN (SELECT id_cia, fechaini,parcial, fechafin, numero FROM calennomina WHERE id_periodo = @1) cp 
            ON c.id_cia = cp.id_cia
            WHERE c.fechafin = cp.fechafin AND c.numero = cp.numero AND c.parcial < cp.parcial)) y
            ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
            GROUP  BY a.id_emp

            UNION

            SELECT a.id_emp,0 AportEmpleado, SUM(pesos) actualH,0 actualN FROM 
            (SELECT e.id_emp, c.id_periodo FROM CalenNomina c, empleados e
            WHERE  c.fechafin >= e.fecha_alta AND e.id_emp IN ( @0 )) a 
            INNER JOIN(SELECT * FROM   nom_histpagos N WHERE  N.id_concepto IN 
            (SELECT fa_empleado FROM ConfigConceptos) AND id_periodo IN ( @1 )) y 
            ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
            GROUP  BY a.id_emp

            UNION

            SELECT a.id_emp,0 AportEmpleado,0 actualH, SUM(pesos)actualN FROM 
            (SELECT e.id_emp,c.id_periodo FROM calennomina c, empleados e
            WHERE  c.fechafin >= e.fecha_alta AND e.id_emp IN ( @0 )) a
            INNER JOIN(SELECT * FROM   histpagos N WHERE  N.id_concepto IN (SELECT fa_empleado
                FROM   configconceptos) AND id_periodo IN ( @1 )) x 
            ON a.id_emp = x.id_emp AND a.id_periodo = x.id_periodo
            GROUP  BY a.id_emp
            -- Hasta aqui
            ) total 
          GROUP  BY id_emp
        `, [id_emp, id_periodo, fecha_inicio, fecha_fin]
      )
    } else {
      aportacion = await AppDataSource.query(
        `
        SELECT id_emp, Sum(aportempleado) + Sum(actualh) + Sum(actualn) AportEmpleado 
          FROM (SELECT a.id_emp, Sum(pesos)AportEmpleado,0 actualH,0 actualN 
          FROM  (SELECT e.id_emp, c.id_periodo FROM calennomina c, empleados e
          WHERE  c.fechafin >= e.fecha_alta AND e.id_emp IN ( @0 ))a 
          INNER JOIN(SELECT * FROM   nom_histpagos N WHERE  N.id_concepto 
          IN (SELECT fa_empleado FROM   configconceptos) AND id_periodo 
          IN (SELECT id_periodo FROM   calennomina c 
          WHERE c.fechaini <= @2 AND c.fechaini >= @3 AND c.fechafin <= 
          (SELECT fechaini FROM calennomina WHERE id_periodo = @1)

          UNION

          SELECT id_periodo FROM   calennomina c 
          INNER JOIN (SELECT id_cia, fechaini,parcial, fechafin, numero FROM calennomina WHERE id_periodo = @1) cp 
          ON c.id_cia = cp.id_cia
          WHERE c.fechafin = cp.fechafin AND c.numero = cp.numero AND c.parcial < cp.parcial)) y
          ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
          GROUP  BY a.id_emp
          ) total 
        GROUP  BY id_emp
        `
      )
    }

    return aportacion[0]
  }

  async findAportacionEmpresa (id_emp: number, id_periodo: number, fecha_inicio: string, fecha_fin: string): Promise<any> {
    const configuracion = await this.findConfiguracion(id_periodo)
    let aportacion = []

    if (configuracion.periodoActualFA) {
      aportacion = await AppDataSource.query(
        `
        SELECT id_emp, SUM(aportempresa) + SUM(actualh) + SUM(actualn) AS AportEmpresa
          FROM
          (
              SELECT a.id_emp, SUM(pesos) + SUM(pesosexcento) AS AportEmpresa, 0 AS actualH, 0 AS actualN
              FROM
              (
                  SELECT e.id_emp, c.id_periodo
                  FROM calennomina c, empleados e
                  WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
              ) a
              INNER JOIN
              (
                  SELECT *
                  FROM nom_histpagos N
                  WHERE N.id_concepto IN (SELECT fa_cia FROM configconceptos)
                  AND id_periodo IN
                  (
                      SELECT id_periodo
                      FROM calennomina c
                      WHERE c.fechaini <= @2 
                      AND c.fechaini >= @3
                      AND c.fechafin <=
                      (
                          SELECT fechaini
                          FROM calennomina
                          WHERE id_periodo = @1
                      )
                      UNION
                      SELECT id_periodo
                      FROM calennomina c
                      INNER JOIN
                      (
                          SELECT id_cia, fechaini, parcial, fechafin, numero
                          FROM calennomina
                          WHERE id_periodo = @1
                      ) cp
                      ON c.id_cia = cp.id_cia
                      WHERE c.fechafin = cp.fechafin
                      AND c.numero = cp.numero
                      AND c.parcial < cp.parcial
                  )
              ) y
              ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
              GROUP BY a.id_emp

              -- Si es con periodo actual agregar esto
              UNION

              SELECT a.id_emp, 0 AS AportEmpresa, SUM(pesos) + SUM(pesosexcento) AS actualN, 0 AS actualH
              FROM
              (
                  SELECT e.id_emp, c.id_periodo
                  FROM calennomina c, empleados e
                  WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
              ) a
              INNER JOIN
              (
                  SELECT *
                  FROM nom_histpagos N
                  WHERE N.id_concepto IN (SELECT fa_cia FROM configconceptos)
                  AND id_periodo IN (@1)
              ) y
              ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
              GROUP BY a.id_emp

              UNION

              SELECT a.id_emp, 0 AS aportEmpresa, 0 AS actualN, SUM(pesos) + SUM(pesosexcento) AS actualH
              FROM
              (
                  SELECT e.id_emp, c.id_periodo
                  FROM calennomina c, empleados e
                  WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
              ) a
              INNER JOIN
              (
                  SELECT *
                  FROM histpagos N
                  WHERE N.id_concepto IN (SELECT fa_cia FROM configconceptos)
                  AND id_periodo IN (@1)
              ) x
              ON a.id_emp = x.id_emp AND a.id_periodo = x.id_periodo
              GROUP BY a.id_emp
              -- Hasta aquí
          ) total
        GROUP BY id_emp;
        `, [id_emp, id_periodo, fecha_inicio, fecha_fin]
      )
    } else {
      aportacion = await AppDataSource.query(
        `
        SELECT id_emp, SUM(aportempresa) + SUM(actualh) + SUM(actualn) AS AportEmpresa
          FROM
          (
              SELECT a.id_emp, SUM(pesos) + SUM(pesosexcento) AS AportEmpresa, 0 AS actualH, 0 AS actualN
              FROM
              (
                  SELECT e.id_emp, c.id_periodo
                  FROM calennomina c, empleados e
                  WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
              ) a
              INNER JOIN
              (
                  SELECT *
                  FROM nom_histpagos N
                  WHERE N.id_concepto IN (SELECT fa_cia FROM configconceptos)
                  AND id_periodo IN
                  (
                      SELECT id_periodo
                      FROM calennomina c
                      WHERE c.fechaini <= @2 
                      AND c.fechaini >= @3
                      AND c.fechafin <=
                      (
                          SELECT fechaini
                          FROM calennomina
                          WHERE id_periodo = @1
                      )
                      UNION
                      SELECT id_periodo
                      FROM calennomina c
                      INNER JOIN
                      (
                          SELECT id_cia, fechaini, parcial, fechafin, numero
                          FROM calennomina
                          WHERE id_periodo = @1
                      ) cp
                      ON c.id_cia = cp.id_cia
                      WHERE c.fechafin = cp.fechafin
                      AND c.numero = cp.numero
                      AND c.parcial < cp.parcial
                  )
              ) y
              ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
              GROUP BY a.id_emp
          ) total
        GROUP BY id_emp;
        `, [id_emp, id_periodo, fecha_inicio, fecha_fin]
      )
    }

    return aportacion[0]
  }

  async findDevolucionEmpleado (id_emp: number, id_periodo: number, fecha_inicio: string, fecha_fin: string): Promise<any> {
    const configuracion = await this.findConfiguracion(id_periodo)
    let devolucion = []

    if (configuracion.periodoActualFA) {
      devolucion = await AppDataSource.query(
      `
      SELECT id_emp, SUM(devempleado) + SUM(devh) + SUM(devn) AS devempleado
      FROM
      (
          SELECT a.id_emp, SUM(pesos) + SUM(pesosexcento) AS devempleado, 0 AS devh, 0 AS devn
          FROM
          (
              SELECT e.id_emp, c.id_periodo
              FROM calennomina c, empleados e
              WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
          ) a
          INNER JOIN
          (
              SELECT *
              FROM nom_histpagos N
              WHERE n.id_concepto IN (SELECT fa_devempleado FROM configconceptos)
              AND id_periodo IN
              (
                  SELECT id_periodo
                  FROM calennomina c
                  WHERE c.fechaini <= @2
                  AND c.fechaini >= @3
                  AND c.fechafin <=
                  (
                      SELECT fechaini
                      FROM calennomina
                      WHERE id_periodo = @1
                  )
                  UNION
                  SELECT id_periodo
                  FROM calennomina c
                  INNER JOIN
                  (
                      SELECT id_cia, fechaini, parcial, fechafin, numero
                      FROM calennomina
                      WHERE id_periodo = @1
                  ) cp
                  ON c.id_cia = cp.id_cia
                  WHERE c.fechafin = cp.fechafin
                  AND c.numero = cp.numero
                  AND c.parcial < cp.parcial
              )
          ) y
          ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
          GROUP BY a.id_emp

          -- Si es con periodo actual agregar esto
          UNION

          SELECT a.id_emp, 0 AS devempleado, SUM(pesos) + SUM(pesosexcento) AS devh, 0 AS devn
          FROM
          (
              SELECT e.id_emp, c.id_periodo
              FROM calennomina c, empleados e
              WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
          ) a
          INNER JOIN
          (
              SELECT *
              FROM nom_histpagos N
              WHERE n.id_concepto IN (SELECT fa_devempleado FROM configconceptos)
              AND id_periodo IN (@1)
          ) y
          ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
          GROUP BY a.id_emp

          UNION

          SELECT a.id_emp, 0 AS devempleado, 0 AS devh, SUM(pesos) + SUM(pesosexcento) AS devn
          FROM
          (
              SELECT e.id_emp, c.id_periodo
              FROM calennomina c, empleados e
              WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
          ) a
          INNER JOIN
          (
              SELECT *
              FROM histpagos N
              WHERE n.id_concepto IN (SELECT fa_devempleado FROM configconceptos)
              AND id_periodo IN (@1)
          ) x
          ON a.id_emp = x.id_emp AND a.id_periodo = x.id_periodo
          GROUP BY a.id_emp
          -- Hasta aquí
      ) total
      GROUP BY id_emp;
      `, [id_emp, id_periodo, fecha_inicio, fecha_fin])
    } else {
      devolucion = await AppDataSource.query(
        `
        SELECT id_emp, SUM(devempleado) + SUM(devh) + SUM(devn) AS devempleado
        FROM
        (
            SELECT a.id_emp, SUM(pesos) + SUM(pesosexcento) AS devempleado, 0 AS devh, 0 AS devn
            FROM
            (
                SELECT e.id_emp, c.id_periodo
                FROM calennomina c, empleados e
                WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
            ) a
            INNER JOIN
            (
                SELECT *
                FROM nom_histpagos N
                WHERE n.id_concepto IN (SELECT fa_devempleado FROM configconceptos)
                AND id_periodo IN
                (
                    SELECT id_periodo
                    FROM calennomina c
                    WHERE c.fechaini <= @2
                    AND c.fechaini >= @3
                    AND c.fechafin <=
                    (
                        SELECT fechaini
                        FROM calennomina
                        WHERE id_periodo = @1
                    )
                    UNION
                    SELECT id_periodo
                    FROM calennomina c
                    INNER JOIN
                    (
                        SELECT id_cia, fechaini, parcial, fechafin, numero
                        FROM calennomina
                        WHERE id_periodo = @1
                    ) cp
                    ON c.id_cia = cp.id_cia
                    WHERE c.fechafin = cp.fechafin
                    AND c.numero = cp.numero
                    AND c.parcial < cp.parcial
                )
            ) y
            ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
            GROUP BY a.id_emp
        ) total
        GROUP BY id_emp;
        `, [id_emp, id_periodo, fecha_inicio, fecha_fin]
      )
    }

    return devolucion[0]
  }

  async findDevolucionEmpresa (id_emp: number, id_periodo: number, fecha_inicio: string, fecha_fin: string): Promise<any> {
    const configuracion = await this.findConfiguracion(id_periodo)
    let devolucion = []

    if (configuracion.periodoActualFA) {
      devolucion = await AppDataSource.query(
        `
        SELECT id_emp, SUM(devempresa) + SUM(devh) + SUM(devn) AS DevEmpresa
        FROM
        (
            SELECT a.id_emp, SUM(pesos) + SUM(pesosexcento) AS DevEmpresa, 0 AS DevH, 0 AS DevN
            FROM
            (
                SELECT e.id_emp, c.id_periodo
                FROM calennomina c, empleados e
                WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
            ) a
            INNER JOIN
            (
                SELECT *
                FROM nom_histpagos N
                WHERE N.id_concepto IN (SELECT fa_devempresa FROM configconceptos)
                AND id_periodo IN
                (
                    SELECT id_periodo
                    FROM calennomina c
                    WHERE c.fechaini <= @2
                    AND c.fechaini >= @3
                    AND c.fechafin <=
                    (
                        SELECT fechaini
                        FROM calennomina
                        WHERE id_periodo = @1
                    )
                    UNION
                    SELECT id_periodo
                    FROM calennomina c
                    INNER JOIN
                    (
                        SELECT id_cia, fechaini, parcial, fechafin, numero
                        FROM calennomina
                        WHERE id_periodo = @1
                    ) cp
                    ON c.id_cia = cp.id_cia
                    WHERE c.fechafin = cp.fechafin
                    AND c.numero = cp.numero
                    AND c.parcial < cp.parcial
                )
            ) y
            ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
            GROUP BY a.id_emp
        
            -- Si es con periodo actual agregar esto
            UNION
        
            SELECT a.id_emp, 0 AS DevEmpresa, SUM(pesos) + SUM(pesosexcento) AS DevH, 0 AS DevN
            FROM
            (
                SELECT e.id_emp, c.id_periodo
                FROM calennomina c, empleados e
                WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
            ) a
            INNER JOIN
            (
                SELECT *
                FROM nom_histpagos N
                WHERE N.id_concepto IN (SELECT fa_devempresa FROM configconceptos)
                AND id_periodo IN (@1)
            ) y
            ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
            GROUP BY a.id_emp
        
            UNION
        
            SELECT a.id_emp, 0 AS DevEmpresa, 0 AS DevH, SUM(pesos) + SUM(pesosexcento) AS DevN
            FROM
            (
                SELECT e.id_emp, c.id_periodo
                FROM calennomina c, empleados e
                WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
            ) a
            INNER JOIN
            (
                SELECT *
                FROM histpagos N
                WHERE N.id_concepto IN (SELECT fa_devempresa FROM configconceptos)
                AND id_periodo IN (@1)
            ) x
            ON a.id_emp = x.id_emp AND a.id_periodo = x.id_periodo
            GROUP BY a.id_emp
            -- Hasta aquí
        ) total
        GROUP BY id_emp;
        `, [id_emp, id_periodo, fecha_inicio, fecha_fin]
      )
    } else {
      devolucion = await AppDataSource.query(
        `
        SELECT id_emp, SUM(devempresa) + SUM(devh) + SUM(devn) AS DevEmpresa
        FROM
        (
            SELECT a.id_emp, SUM(pesos) + SUM(pesosexcento) AS DevEmpresa, 0 AS DevH, 0 AS DevN
            FROM
            (
                SELECT e.id_emp, c.id_periodo
                FROM calennomina c, empleados e
                WHERE c.fechafin >= e.fecha_alta AND e.id_emp IN (@0)
            ) a
            INNER JOIN
            (
                SELECT *
                FROM nom_histpagos N
                WHERE N.id_concepto IN (SELECT fa_devempresa FROM configconceptos)
                AND id_periodo IN
                (
                    SELECT id_periodo
                    FROM calennomina c
                    WHERE c.fechaini <= @2
                    AND c.fechaini >= @3
                    AND c.fechafin <=
                    (
                        SELECT fechaini
                        FROM calennomina
                        WHERE id_periodo = @1
                    )
                    UNION
                    SELECT id_periodo
                    FROM calennomina c
                    INNER JOIN
                    (
                        SELECT id_cia, fechaini, parcial, fechafin, numero
                        FROM calennomina
                        WHERE id_periodo = @1
                    ) cp
                    ON c.id_cia = cp.id_cia
                    WHERE c.fechafin = cp.fechafin
                    AND c.numero = cp.numero
                    AND c.parcial < cp.parcial
                )
            ) y
            ON a.id_emp = y.id_emp AND a.id_periodo = y.id_periodo
            GROUP BY a.id_emp
        ) total
        GROUP BY id_emp;
        `, [id_emp, id_periodo, fecha_inicio, fecha_fin]
      )
    }

    return devolucion[0]
  }

  async findInformacionTimbrado (id_emp: number, id_periodo: number): Promise<Timbrado | null> {
    const informacion = await Timbrado.findOne({ where: { id_emp, id_periodo } })

    return informacion
  }

  async findLeyendas (id_periodo: number): Promise<CalendarioNomina | null> {
    const calendarioNomina = await CalendarioNomina.findOne({ where: { id_periodo } })

    return calendarioNomina
  }

  async findDatosPeriodo (id_periodo: number): Promise<{ datosPeriodo: string }> {
    const datosPeriodo = await AppDataSource.query(
      `
      SELECT RIGHT('0000' + CAST(año AS VARCHAR(4)), 4) + RIGHT('00' + CAST(numero AS VARCHAR(2)), 2) + RIGHT('0000' + CAST(parcial AS VARCHAR(2)), 2) AS datosPeriodo 
      FROM CalenNomina
      WHERE id_periodo = @0
      `, [id_periodo]
    )

    return datosPeriodo[0]
  }

  async findNumEmpleado (id_emp: number): Promise<{ numEmpleado: string }> {
    const numEmpleado = await AppDataSource.query(
      'SELECT RIGHT(\'00000\' + CAST(noempx AS VARCHAR(6)),6) AS numEmpleado FROM empleados WHERE id_emp = @0;', [id_emp]
    )

    return numEmpleado[0]
  }

  async findConfiguracionConcepto (): Promise<{ conceptoRecibo1: string, conceptoRecibo2: string }> {
    const configuracion = await AppDataSource.query('SELECT conceptoRecibo1, conceptoRecibo2 FROM configRecibo WHERE id_razonSocial = (SELECT id_razonSocial FROM ConfigRs) AND id_recibo = 5'
    )

    console.log('Bla: ', configuracion)

    return configuracion[0]
  }

  async findConcepto (id_concepto: number): Promise<any> {
    const concepto = await Concepto.findOne({ where: { id_concepto } })

    return concepto
  }

  async findSaldoConcepto (id_emp: number, id_periodo: number, id_concepto: number, id_plaza: number): Promise<any> {
    const saldo = await AppDataSource.query(
      `
      SELECT Isnull(Sum(saldo), 0) saldo
      FROM   (SELECT id_emp,id_plaza,Sum(pesos) + Sum(pesosexcento) saldo FROM nom_histpagos nh 
        INNER JOIN (SELECT cn.* FROM   calennomina cn
          INNER JOIN (SELECT id_cia, año, fechafin, fechaini, numero, parcial, id_periodo FROM calennomina c WHERE  id_periodo = @1) ca
          ON cn.año = ca.año AND cn.fechaini < ca.fechafin AND cn.numero <= ca.numero AND 
            CASE WHEN cn.numero = ca.numero 
              THEN cn.parcial ELSE ca.parcial END <= ca.parcial
            UNION SELECT cn.* FROM calennomina cn INNER JOIN (
              SELECT id_cia, año, fechafin, fechaini, numero, parcial, id_periodo FROM calennomina c WHERE  id_periodo = @1) ca 
            ON cn.año < ca.año)c 
            ON nh.id_periodo = c.id_periodo WHERE  id_emp = @0 AND id_plaza = @3 AND id_concepto = @2
      GROUP  BY id_emp, id_plaza, id_concepto
        UNION SELECT id_emp, id_plaza, Sum(pesos) + Sum(pesosexcento) saldo FROM   histpagos nh 
          INNER JOIN (SELECT cn.* FROM calennomina cn INNER JOIN (SELECT id_cia, año, fechafin, fechaini, numero, parcial, id_periodo FROM   calennomina c 
            WHERE  id_periodo = @1) ca ON cn.año = ca.año AND cn.fechaini < ca.fechafin AND cn.numero <= ca.numero AND 
              CASE WHEN cn.numero = ca.numero
                THEN cn.parcial ELSE ca.parcial END <= ca.parcial 
              UNION SELECT cn.* FROM calennomina cn 
                INNER JOIN (
                  SELECT id_cia, año, fechafin, fechaini, numero, parcial, id_periodo FROM calennomina c WHERE  id_periodo = @1) ca 
                ON cn.año < ca.año) c ON nh.id_periodo = c.id_periodo WHERE id_emp = @0 AND id_plaza = @3 AND id_concepto = @2
      GROUP  BY id_emp, id_plaza, id_concepto) pagos 
      `, [id_emp, id_periodo, id_concepto, id_plaza]
    )

    return saldo[0]
  }

  async findConfiguracionPlazas () {
    const configuracion = await AppDataSource.query(`
      SELECT CASE WHEN id_estructura_temporal = 0 THEN 1 ELSE 0 END Flag FROM ConfigRS
    `)

    return configuracion[0]
  }

  async findInformacionPlazas (id_emp: number, id_periodo: number) {
    const informacion = await AppDataSource.query(`
    SELECT 
      [dbo].[FC_DatosPeriodo_varchar] (id_emp, id_plaza, id_periodo, 'numplaza') AS No_plaza, 
      [dbo].[FC_DatosPeriodo_varchar] (id_emp, id_plaza, id_periodo, 'DescDeptoPlaza') AS DescDeptoPlaza,
      [dbo].[FC_DatosPeriodo_varchar] (id_emp, id_plaza, id_periodo, 'DescCategoriaPlaza') AS DescCategoriaPlaza,
      [dbo].[FC_DatosPeriodo_varchar] (id_emp, id_plaza, id_periodo, 'DescPuestoPlaza') AS DescPuestoPlaza,
      [dbo].[FC_DatosPeriodo_varchar] (id_emp, id_plaza, id_periodo, 'DescNivelPlaza') AS DescNivelPlaza
    FROM datosperiodo WHERE id_periodo=@1 AND id_emp=@0
    `, [id_emp, id_periodo])

    return informacion
  }
}
