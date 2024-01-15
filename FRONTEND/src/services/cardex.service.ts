import { CardexModel, CardexYears, LlavesCardex } from '../models/cardex.model'
import { instance } from '../networking/axios'

class CardexService {
  async fetchLlavesCardex (): Promise<LlavesCardex[]> {
    const keys = await instance.get('/cardex/llaves')

    return keys.data
  }

  async fetchCardex (year: string): Promise<CardexModel> {
    const cardex = await instance.get(`/cardex/${year}`)

    return cardex.data
  }

  async fetchYears (): Promise<CardexYears[]> {
    const years = await instance.get('/cardex/years')

    return years.data
  }
}

export const cardexService = new CardexService()
