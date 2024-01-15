import { NextFunction, Request, Response } from 'express'
import { VacacionesService } from './services'
import logger from '@/helpers/logger'

export async function index (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { tipo } = req.params
  const finder = new VacacionesService()
  try {
    const vacaciones = await finder.findAll(id_emp, Number(tipo))

    res.json(vacaciones)
  } catch (error: any) {
    logger.error('Error al obtener vacaciones: ', error)
    next(error)
  }
}
