import { Empleado, HSupervisor } from '@/entities/empleados'
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
      empleado
    ]

    const result = await Promise.all(promises)

    return {
      ...result[1],
      supervisor: result[0]
    }
  }

  async findSupervisor (id: number): Promise<HSupervisor[]> {
    const supervisor = await HSupervisor.find({
      relations: {
        supervisor: true
      },
      order: {
        fecha: 'DESC'
      },
      where: { id_emp: id }
    })

    if (supervisor == null) throw new HTTPError(404, 'Supervisor no encontrado')

    return supervisor
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
