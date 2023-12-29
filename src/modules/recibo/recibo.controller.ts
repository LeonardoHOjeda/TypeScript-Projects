import { NextFunction, Request, Response } from 'express'
import { ReciboService } from './services'
import logger from '@/helpers/logger'

export async function years (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const finder = new ReciboService()
  try {
    const years = await finder.findYears(id_emp)

    res.json(years)
  } catch (error: any) {
    logger.error('Error al obtener los años de la nomina: ', error)
  }
}

/**
 * Return one instance of entity
 * @param req
 * @param res
 * @param next
 */
export async function show (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const finder = new ReciboService()
}

/**
 * Save an entity
 * @param req
 * @param res
 * @param next
 */
export async function store (req: Request, res: Response, next: NextFunction): Promise<void> {
  const saver = new ReciboService()
}

/**
 * Update an entity
 * @param req
 * @param res
 * @param next
 */
export async function update (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const updater = new ReciboService()
}

/**
 * Destroy one instance of an entity
 * @param req
 * @param res
 * @param next
 */
export async function destroy (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const destroyer = new ReciboService()
}
