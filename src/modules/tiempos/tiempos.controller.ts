import { NextFunction, Request, Response } from 'express'
import { TiemposService } from './services'
import logger from '@/helpers/logger'
import { formatDate } from '@/helpers/helpers'

/**
 * Return all entities
 * @param req
 * @param res
 * @param next
 */
export async function index (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { periodo } = req.query

  const fecha_inicio = (periodo as string).split('al')[0].trim()
  const fecha_fin = (periodo as string).split('al')[1].trim()

  const fecha_inicio_format = formatDate(fecha_inicio)
  const fecha_fin_format = formatDate(fecha_fin)

  try {
    const finder = new TiemposService()
    const tiempos = await finder.findAll(id_emp, fecha_inicio_format, fecha_fin_format)

    res.json(tiempos)
  } catch (error: any) {
    logger.error('Error al obtener los tiempos de un empleado: ', error)
    next(error)
  }
}
