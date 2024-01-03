import { Incapacidades, Incidencias } from '@/entities/justificantes'
import { Justificantes } from '@/entities/justificantes/justificantes.entity'

export class JustificantesService {
  async findAll (): Promise<Justificantes[]> {
    const justificantes = await Justificantes.find({
      relations: {
        incapacidad: true,
        incidencia: true,
        nivel: true
      }
    })

    return justificantes
  }

  async findIncidencias (): Promise<Incidencias[]> {
    const incidencias = await Incidencias.find()

    return incidencias
  }

  async findIncapacidades (): Promise<Incapacidades[]> {
    const incapacidades = await Incapacidades.find()

    return incapacidades
  }

  async findOne (id: any): Promise<Object> {
    return {}
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
