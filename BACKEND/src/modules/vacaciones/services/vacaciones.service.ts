import { AppDataSource } from '@/database/datasources'

export class VacacionesService {
  async findAll (id_emp: number, tipo: number): Promise<Object[]> {
    let vacaciones = []

    if (tipo === 1) {
      vacaciones = await AppDataSource.query(`
      SELECT empFin.NOEMPx noEmpx, (empFin.Nombre + ' ' + empFin.ApPaterno + ' ' + empFin.ApMaterno) nombre,
        empFin.Fecha_Alta fechaAlta, CAST(MAX(av.Antiguedad) AS VARCHAR(2)) AS antiguedad, SUM(ROUND(av.Dias, 2)) AS diasGanados,
        SUM(ROUND(ISNULL(VAC.diasPagados, 0), 2)) AS diasPagados, SUM(ISNULL(t1.diasAjustados, 0)) AS ajuste, 
        SUM(ROUND((av.Dias - ISNULL(VAC.diasPagados, 0) + ISNULL(t1.diasAjustados, 0)), 2)) AS saldoDiasPorPagar, '' razonAjuste
      FROM Empleados empFin
      INNER JOIN AdminVacaciones av ON av.id_emp = empFin.Id_Emp AND av.TipoMov = 'D'
      LEFT JOIN (
        SELECT id_emp, Antiguedad, SUM(Dias) AS diasPagados
        FROM AdminVacaciones
        WHERE TipoMov = 'P'
        GROUP BY id_emp, Antiguedad
      ) VAC ON VAC.Id_emp = av.id_emp AND av.Antiguedad = VAC.Antiguedad
      LEFT JOIN (
        SELECT av.Id_Emp, av.Antiguedad, SUM(Dias) AS DiasAjustados, av.id_razonajuste
        FROM AdminVacaciones av
        WHERE av.TipoMov = 'A' AND av.id_razonajuste <> 0
        GROUP BY av.id_emp, av.antiguedad, av.id_razonajuste
      ) t1 ON t1.Id_Emp = av.Id_Emp AND av.Antiguedad = t1.Antiguedad
        LEFT JOIN razonesAjustesVacaciones rav ON rav.id_razonAjusteVacaciones = t1.id_razonajuste
        WHERE empFin.id_emp = @0
        GROUP BY empFin.NOEMPx, empFin.id_emp, empFin.Nombre, empFin.ApPaterno, empFin.ApMaterno, empFin.Fecha_Alta, av.Antiguedad
      `, [id_emp])
    } else {
      vacaciones = await AppDataSource.query(`
      WITH tmpVacaciones AS (
        SELECT e.Id_Emp, av.Antiguedad, av.Dias AS DiasGanados, ISNULL(VAC.diasPagados, 0) AS diasPagados, ISNULL(ISNULL(av.Dias, 0) - ISNULL(VAC.diasPagados, 0), 0) AS SaldoDiasPorPagar,
          ISNULL(t1.diasAjustados, 0) AS diasAjustados, ISNULL(CAST(rav.claveAjuste AS VARCHAR) + ' - ' + rav.Descripcion, '') AS RazonAjuste, ant2.fechaCalculo 
          FROM Empleados e 
          INNER JOIN (
            SELECT av.id_emp, antiguedad, dias
            FROM AdminVacaciones av WHERE TipoMov = 'D'
          ) av ON av.id_emp = e.Id_Emp
          LEFT JOIN (
            SELECT id_emp, MAX(Antiguedad) AS MaxAntiguedad 
            FROM AdminVacaciones av WHERE TipoMov = 'D' GROUP BY Id_Emp
          ) ant ON av.Id_Emp = ant.id_emp
          LEFT JOIN (
            SELECT id_emp, antiguedad, fechaCalculo
            FROM AdminVacaciones WHERE TipoMov = 'D'
          ) ant2 ON ant2.id_emp = ant.id_emp AND ant2.Antiguedad = ant.MaxAntiguedad
          LEFT JOIN (
            SELECT tmp.Id_Emp, antiguedad, SUM(diasPagados) AS diasPagados 
            FROM (
              SELECT av.id_emp, av.antiguedad, 
              CASE 
                WHEN av.TipoMov = 'P'
                THEN SUM(av.dias)
                ELSE 0 
                END AS DiasPagados
              FROM AdminVacaciones av GROUP BY av.id_emp, av.Antiguedad, av.TipoMov
            ) tmp GROUP BY tmp.Id_Emp, tmp.Antiguedad
          ) VAC ON VAC.Id_emp = av.id_emp AND av.antiguedad = VAC.Antiguedad
          LEFT JOIN (
            SELECT tmp.Id_Emp, Antiguedad, SUM(DiasAjustados) AS diasAjustados, tmp.id_razonajuste
            FROM (
              SELECT av.Id_Emp, av.Antiguedad,
              CASE 
                WHEN av.TipoMov = 'A'
                THEN SUM(av.dias)
                ELSE 0
                END AS DiasAjustados, av.id_razonajuste
              FROM AdminVacaciones av GROUP BY av.id_emp, av.antiguedad, av.TipoMov, av.id_razonajuste
            ) tmp
            WHERE id_razonajuste <> 0 GROUP BY tmp.Id_Emp, tmp.Antiguedad, tmp.id_razonajuste
          ) t1 ON t1.Id_Emp = av.Id_Emp AND av.Antiguedad = t1.Antiguedad
          LEFT JOIN razonesAjustesVacaciones rav ON rav.id_razonAjusteVacaciones = t1.id_razonajuste)
        
        SELECT empFin.NOEMPx noEmpx, (empFin.Nombre + ' ' + empFin.ApPaterno + ' ' + empFin.ApMaterno) nombre, empFin.Fecha_Alta fechaAlta, CAST(max(Antiguedad) AS VARCHAR(2)) AS antiguedad, 
          sum(ROUND(diasganados, 2)) AS diasGanados, sum(ROUND(diaspagados, 2)) AS diasPagados, sum(diasAjustados) AS ajuste, 
          sum(ROUND((DiasGanados - diasPagados + diasAjustados), 2)) AS saldoDiasPorPagar, '' razonAjuste 
          FROM tmpVacaciones t
          INNER JOIN (
            SELECT id_emp, MAX(Antiguedad) AS anioCurso FROM tmpVacaciones GROUP BY id_emp
          ) x ON x.Id_Emp = t.Id_Emp
          INNER JOIN empleados empFin ON t.id_emp = empFin.id_emp
          WHERE empFin.id_emp = @0
          GROUP BY noempx, empfin.id_emp, fecha_alta, nombre, appaterno, apmaterno, vigencia, fecha_baja, fechaCalculo
      `, [id_emp])
    }

    return vacaciones
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
