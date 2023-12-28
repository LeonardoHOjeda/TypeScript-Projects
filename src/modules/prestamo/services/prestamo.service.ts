import { Prestamo } from '@/entities/prestamo.entity'

export class PrestamoService {
  async findAll (id_emp: number): Promise<Prestamo[]> {
    const prestamos = await Prestamo.createQueryBuilder('prestamo')
      .select(['prestamo.id_concepto id_concepto', 'concepto.descripcion descripcion'])
      .leftJoin('prestamo.concepto', 'concepto')
      .where('prestamo.id_emp = :id_emp', { id_emp })
      .andWhere('prestamo.status = :status', { status: 'A' })
      .groupBy('prestamo.id_concepto')
      .addGroupBy('concepto.descripcion')
      .getRawMany()

    return prestamos
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
