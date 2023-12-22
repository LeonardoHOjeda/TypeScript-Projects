import { Empleado, HSupervisor } from '@/entities/empleados'
import { HBanco, HMedioPago } from '@/entities/nomina'
// import { Supervisor } from '@/entities/empleados/supervisor.entity'
import { HTTPError } from '@/middlewares/error_handler'

export class EmpleadoService {
  async findOne (id_emp: number, noempx: string): Promise<any> {
    const empleado = await Empleado.findOne({
      relations: {
        nacionalidad: true,
        estado_nacimiento: true,
        estado_civil: true,
        supervisor: true
      },
      where: { noempx }
    })

    if (empleado == null) throw new HTTPError(404, 'Empleado no encontrado')

    const promises = [
      this.findSupervisor(id_emp),
      this.findMetodoPago(id_emp),
      this.findBanco(id_emp),
      empleado
    ]

    const result = await Promise.all(promises)

    return {
      ...result[1],
      supervisor: result[0],
      metodoPago: result[1],
      banco: result[2]
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

  async findAll (): Promise<Empleado[]> {
    const empleados = await Empleado.find()

    return empleados
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
