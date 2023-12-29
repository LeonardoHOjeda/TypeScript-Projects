import { NextFunction, Request, Response } from 'express'
import { PrestamoService } from './services'
import logger from '@/helpers/logger'

export async function index (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new PrestamoService()
  const { id_emp } = req.user!
  try {
    const prestamos = await finder.findAll(id_emp)

    res.json(prestamos)
  } catch (error: any) {
    logger.error('Error al obtener los prestamos', error)
    next(error)
  }
}

export async function show (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const { id_emp } = req.user!
  const finder = new PrestamoService()
  try {
    const prestamo = await finder.findOne(id_emp, Number(id))

    res.json(prestamo)
  } catch (error: any) {
    logger.error('Error al obtener el prestamo', error)
    next(error)
  }
}
