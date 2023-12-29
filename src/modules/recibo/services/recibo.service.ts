import { CalendarioNomina } from '@/entities/recibo'

export class ReciboService {
  async findYears (id_emp: number): Promise<Object> {
    const years = await CalendarioNomina.createQueryBuilder('calendario')
      .select(['calendario.año id'])
      .leftJoin('calendario.nominas', 'nomina')
      .where('nomina.id_emp = :id_emp', { id_emp })
      .groupBy('calendario.año')
      .orderBy('calendario.año', 'DESC')
      .getRawMany()

    return years
  }

  async findAll (): Promise<Object[]> {
    return []
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
