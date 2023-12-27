import { Cardex, Llaves } from '@/entities/cardex.entity'

export class CardexService {
  async findCardex (id_emp: number, year: string): Promise<Cardex | object> {
    const cardex = await Cardex.findOne({ where: { id_emp, acardex: year } })

    if (cardex == null) return {}

    return cardex
  }

  async findLlaves (): Promise<Llaves[]> {
    const llaves = await Llaves.find()

    return llaves
  }

  async findCardexYears (id_emp: number): Promise<any> {
    const years = await Cardex.query('SELECT acardex FROM CardexxEmp WHERE id_emp = @0 ORDER BY acardex DESC', [id_emp])

    return years
  }
}
