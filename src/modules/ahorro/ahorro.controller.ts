import { NextFunction, Request, Response } from 'express'
import { AhorroService } from './services'
import logger from '@/helpers/logger'

export async function fechas (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_cia } = req.user!

  const finder = new AhorroService()

  try {
    const fechas = await finder.findFechas(id_cia)

    res.json(fechas)
  } catch (error: any) {
    logger.error('Error al obtener los cortes de fondo de ahorro: ', error)
    next(error)
  }
}

export async function conceptos (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new AhorroService()

  try {
    const conceptos = await finder.findConceptos()

    res.json(conceptos)
  } catch (error: any) {
    logger.error('Error al obtener los conceptos: ', error)
    next(error)
  }
}

export async function ahorro (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { fechaInicio, fechaFin } = req.query

  const finder = new AhorroService()

  try {
    const ahorro = await finder.findAhorro(id_emp, (fechaInicio as string), (fechaFin as string))

    res.json(ahorro)
  } catch (error: any) {
    logger.error('Error al obtener los ahorros: ', error)
    next(error)
  }
}
