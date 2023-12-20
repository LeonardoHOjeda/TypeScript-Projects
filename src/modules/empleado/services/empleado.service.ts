import { Empleado } from '@/entities/empleados'

export class EmpleadoService {
  async findOne (id: any): Promise<Object> {
    return {}
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
