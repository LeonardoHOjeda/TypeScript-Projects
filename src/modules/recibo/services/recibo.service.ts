import { RazonSocial, RegistroPatronal } from '@/entities/empleados'
import { CalendarioNomina } from '@/entities/recibo'

export class ReciboService {
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

  async findRegistroPatronal (): Promise<any> {
    const registro = await RegistroPatronal.find()

    return registro
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

  async update (id: any, body: any): Promise<Object> {
    return {}
  }

  async store (body: any): Promise<Object> {
    return {}
  }

  async destroy (id: any): Promise<Object> {
    return {}
  }

  async delete (id: any): Promise<Object> {
    return {}
  }
}
