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
  const finder = new PrestamoService()
}

/**
 * Save an entity
 * @param req
 * @param res
 * @param next
 */
export async function store (req: Request, res: Response, next: NextFunction): Promise<void> {
  const saver = new PrestamoService()
}

/**
 * Update an entity
 * @param req
 * @param res
 * @param next
 */
export async function update (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const updater = new PrestamoService()
}

/**
 * Destroy one instance of an entity
 * @param req
 * @param res
 * @param next
 */
export async function destroy (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const destroyer = new PrestamoService()
}
