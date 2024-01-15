import { NextFunction, Request, Response } from 'express'
import { CardexService } from './services'
import logger from '@/helpers/logger'

export async function cardex (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { year } = req.params
  const { id_emp } = req.user!

  const finder = new CardexService()
  try {
    const cardex = await finder.findCardex(id_emp, year)

    res.json(cardex)
  } catch (error: any) {
    logger.error('Error al obtener cardex: ', error)
    next(error)
  }
}

export async function llaves (_req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new CardexService()
  try {
    const llaves = await finder.findLlaves()

    res.json(llaves)
  } catch (error: any) {
    logger.error('Error al obtener llaves: ', error)
    next(error)
  }
}

export async function cardexYears (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!

  const finder = new CardexService()
  try {
    const años = await finder.findCardexYears(id_emp)

    res.json(años)
  } catch (error: any) {
    logger.error('Error al obtener años del Cardex: ', error)
    next(error)
  }
}
