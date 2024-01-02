import { NextFunction, Request, Response } from 'express'
import { AhorroService } from './services'
import logger from '@/helpers/logger'

export async function index (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_cia } = req.user!
  const finder = new AhorroService()
  try {
    const cortes = await finder.findAll(id_cia)

    res.json(cortes)
  } catch (error: any) {
    logger.error('Error al obtener los cortes de fondo de ahorro', error)
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
  const finder = new AhorroService()
}

/**
 * Save an entity
 * @param req
 * @param res
 * @param next
 */
export async function store (req: Request, res: Response, next: NextFunction): Promise<void> {
  const saver = new AhorroService()
}

/**
 * Update an entity
 * @param req
 * @param res
 * @param next
 */
export async function update (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const updater = new AhorroService()
}

/**
 * Destroy one instance of an entity
 * @param req
 * @param res
 * @param next
 */
export async function destroy (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const destroyer = new AhorroService()
}
