import { Empleado, HSupervisor } from '@/entities/empleados'
import { HBanco, HLinea, HMedioPago } from '@/entities/nomina'
import { HArea } from '@/entities/nomina/area.entity'
import { HCategoria } from '@/entities/nomina/categoria.entity'
import { HCCosto } from '@/entities/nomina/centro_costo.entity'
import { HDepartamento } from '@/entities/nomina/departamento.entity'
import { HHorario } from '@/entities/nomina/horario.entity'
import { HTurno } from '@/entities/nomina/turno.entity'
// import { Supervisor } from '@/entities/empleados/supervisor.entity'
import { HTTPError } from '@/middlewares/error_handler'

export class EmpleadoService {
  async findOne (id_emp: number, noempx: string): Promise<any> {
    const empleado = await Empleado.findOne({
      relations: {
        nacionalidad: true,
        estado_nacimiento: true,
        estado_civil: true
      },
      where: { noempx }
    })

    if (empleado == null) throw new HTTPError(404, 'Empleado no encontrado')

    const promises = [
      this.findSupervisor(id_emp),
      this.findMetodoPago(id_emp),
      this.findBanco(id_emp),
      this.findHorario(id_emp),
      this.findTurno(id_emp),
      this.findArea(id_emp),
      this.findCategoria(id_emp),
      this.findCentroCosto(id_emp),
      this.findDepartamento(id_emp),
      this.findLinea(id_emp),
      empleado
    ]

    const result = await Promise.all(promises)

    return {
      empleado,
      nomina: {
        supervisor: result[0],
        metodoPago: result[1],
        banco: result[2],
        horario: result[3],
        turno: result[4],
        area: result[5],
        categoria: result[6],
        centroCosto: result[7],
        departamento: result[8],
        linea: result[9]
      }
    }
  }

  async findSupervisor (id_emp: number): Promise<HSupervisor | object> {
    const supervisor = await HSupervisor.findOne({
      select: { id_emp: true, fecha: true },
      relations: { supervisor: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (supervisor == null) return {}

    return supervisor.supervisor
  }

  async findMetodoPago (id_emp: number): Promise<HMedioPago | object> {
    const medioPago = await HMedioPago.findOne({
      relations: { medioPago: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (medioPago == null) return {}

    return medioPago.medioPago
  }

  async findBanco (id_emp: number): Promise<HBanco | object> {
    const banco = await HBanco.findOne({
      relations: { banco: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (banco == null) return {}

    return banco.banco
  }

  async findHorario (id_emp: number): Promise<HHorario | object> {
    const horario = await HHorario.findOne({
      relations: { horario: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (horario == null) return {}

    return horario.horario
  }

  async findTurno (id_emp: number): Promise<HTurno | object> {
    const turno = await HTurno.findOne({
      relations: { turno: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (turno == null) return {}

    return turno.turno
  }

  async findArea (id_emp: number): Promise<HArea | object> {
    const area = await HArea.findOne({
      relations: { area: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (area == null) return {}

    return area.area
  }

  async findCategoria (id_emp: number): Promise<HCategoria | object> {
    const categoria = await HCategoria.findOne({
      relations: { categoria: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (categoria == null) return {}

    return categoria.categoria
  }

  async findCentroCosto (id_emp: number): Promise<HCCosto | object> {
    const centroCosto = await HCCosto.findOne({
      relations: { centro_costo: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (centroCosto == null) return {}

    return centroCosto.centro_costo
  }

  async findDepartamento (id_emp: number): Promise<HDepartamento | object> {
    const departamento = await HDepartamento.findOne({
      relations: { departamento: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (departamento == null) return {}

    return departamento.departamento
  }

  async findLinea (id_emp: number): Promise<HLinea | object> {
    const linea = await HLinea.findOne({
      relations: { linea: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (linea == null) return {}

    return linea.linea
  }
}
