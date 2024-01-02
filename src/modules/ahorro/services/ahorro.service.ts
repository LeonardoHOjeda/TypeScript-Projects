import { Conceptos, ConfigConceptos } from '@/entities/conceptos.entity'
import { FondoAhorro } from '@/entities/fondo_ahorro.entity'
import { CalendarioNomina } from '@/entities/recibo'

export class AhorroService {
  async findFechas (id_cia: number): Promise<FondoAhorro[]> {
    const cortes = await FondoAhorro.find({
      where: { id_cia, actualizado: false },
      order: { fechaCorte: 'DESC' }
    })

    return cortes
  }

  async findConceptos (): Promise<Conceptos[]> {
    const configuracion = (await ConfigConceptos.find()).at(0)

    const conceptos = await Conceptos.find({
      where: [{ id_concepto: configuracion!.fa_empleado }, { id_concepto: configuracion!.fa_cia }]
    })

    return conceptos
  }

  async findAhorro (id_emp: number, fechaInicio: string, fechaFin: string): Promise<any> {
    const conceptoEmpleado = (await ConfigConceptos.find()).at(0)!.fa_empleado
    console.log('conceptoEmpleado', conceptoEmpleado)

    const conceptoEmpresa = (await ConfigConceptos.find()).at(0)!.fa_cia
    console.log('conceptoEmpresa', conceptoEmpresa)

    const ahorro = await CalendarioNomina.query(
      `
      SELECT año, numero, parcial, fechaini, fechafin, fondoEmp, fondoCia
      FROM calennomina
      INNER JOIN (
        SELECT SUM(pesos)+SUM(pesosexcento) fondoEmp, id_emp, id_periodo
        FROM nom_histpagos
        WHERE id_concepto = @1 AND id_emp = @0
        GROUP BY id_emp, id_periodo
      ) AS pagos ON pagos.id_periodo=calennomina.id_periodo
      INNER JOIN (
        SELECT SUM(pesos)+SUM(pesosexcento) fondoCia, id_emp, id_periodo
        FROM nom_histpagos
        WHERE id_concepto = @2 AND id_emp = @0
        GROUP BY id_emp, id_periodo
      ) AS pagos2 ON pagos2.id_periodo=calennomina.id_periodo
      WHERE fechaini >= @3 AND fechafin <= @4
      ORDER BY año DESC, numero DESC, parcial DESC
      `, [id_emp, conceptoEmpleado, conceptoEmpresa, fechaInicio, fechaFin]
    )

    return ahorro
  }
}
