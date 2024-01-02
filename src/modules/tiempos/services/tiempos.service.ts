import { Registro } from '@/entities/tiempos'
import { Tiempos } from '@/entities/tiempos/tiempos.entity'
import { toLocalDate } from '@/helpers/helpers'
import { Between } from 'typeorm'

export class TiemposService {
  async findOne (id: any): Promise<Object> {
    return {}
  }

  async findAll (id_emp: number, fecha_inicio: string, fecha_fin: string): Promise<Record<string, any>> {
    const tiempos = await Tiempos.find({
      where: {
        idEmpleado: id_emp,
        fecha: Between(fecha_inicio, fecha_fin),
        cardex: {
          acardex: '2023'
        }
      },
      relations: {
        cardex: true,
        registro: true
      }
    })

    const filteredData: Record<string, any> = {}
    tiempos.forEach((tiempo) => {
      const date = new Date(tiempo.fecha).toDateString()
      if (filteredData[date] === undefined) {
        filteredData[date] = {
          fecha: tiempo.fecha,
          tiempoNormal: tiempo.tiempoNormal,
          tiempoExtra: tiempo.tiempoExtra,
          tExtraAut: tiempo.tExtraAut,
          tAusente: tiempo.tAusente,
          cardex: tiempo.cardex,
          entrada: null,
          salida: null
        }
      }

      const hora_entrada = tiempo.registro.find((registro: Registro) => registro.movi === 1)
      const hora_salida = tiempo.registro.find((registro: Registro) => registro.movi === 0)
      if (hora_entrada != null) (filteredData[date].entrada = { ...hora_entrada, fechaHora: toLocalDate(hora_entrada.fechaHora) })
      if (hora_salida != null) (filteredData[date].salida = { ...hora_salida, fechaHora: toLocalDate(hora_salida.fechaHora) })
    })

    return Object.values(filteredData)
  }

  async findPeriodos (id_cia: number): Promise<any> {
    const periodos = await Tiempos.query(
      `
      SELECT TOP 5 fecha_periodo, periodo 
      FROM (
        SELECT 
            CAST(CONVERT(VARCHAR(10), FechaIni, 111)  AS varchar)+'-'+CAST(CONVERT(VARCHAR(10), FechaFin, 111)  AS varchar) AS fecha_periodo, 
            CAST(CONVERT(VARCHAR(10), FechaIni, 105)  AS varchar)+' al '+CAST(CONVERT(VARCHAR(10), FechaFin, 105)  AS varchar) AS periodo,
            FechaFinTransfer
        FROM 
            calennomina
        WHERE 
          año IN (YEAR(GETDATE()), YEAR(GETDATE()) - 1) AND
            id_cia = @0 AND 
            parcial = 0 AND 
            GETDATE() BETWEEN FechaIniTransfer AND FechaFinTransfer 
  
        UNION 
  
        SELECT 
            CAST(CONVERT(VARCHAR(10), FechaIni, 111)  AS varchar)+'-'+CAST(CONVERT(VARCHAR(10), FechaFin, 111)  AS varchar) AS id_periodo, 
            CAST(CONVERT(VARCHAR(10), FechaIni, 105)  AS varchar)+' al '+CAST(CONVERT(VARCHAR(10), FechaFin, 105)  AS varchar) AS periodo,
            FechaFinTransfer
        FROM 
            calennomina
        WHERE 
          año IN (YEAR(GETDATE()), YEAR(GETDATE()) - 1) AND
            id_cia = @0 AND 
            parcial = 0 AND 
            FechaFinTransfer < GETDATE()
      ) fechas
      ORDER BY 
        FechaFinTransfer DESC
      `, [id_cia]
    )

    return periodos
  }
}
