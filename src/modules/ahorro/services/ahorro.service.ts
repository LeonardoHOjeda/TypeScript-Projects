import { FondoAhorro } from '@/entities/fondo_ahorro.entity'

export class AhorroService {
  async findAll (id_cia: number): Promise<Object[]> {
    const cortes = await FondoAhorro.find({
      where: { id_cia, actualizado: false },
      order: { fechaCorte: 'DESC' }
    })

    return cortes
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
