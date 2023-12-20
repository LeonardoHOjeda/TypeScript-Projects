import { NextFunction, Request, Response } from 'express'
import { EmpleadoService } from './services'
import logger from '@/helpers/logger'

export async function index (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new EmpleadoService()
  try {
    const empleados = await finder.findAll()

    res.json(empleados)
  } catch (error) {
    logger.error('Error al obtener todos los empleados')
    next(error)
  }
}

export async function show (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const finder = new EmpleadoService()
}

export async function store (req: Request, res: Response, next: NextFunction): Promise<void> {
  const saver = new EmpleadoService()
}

/**
 * Update an entity
 * @param req
 * @param res
 * @param next
 */
export async function update (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const updater = new EmpleadoService()
}

/**
 * Destroy one instance of an entity
 * @param req
 * @param res
 * @param next
 */
export async function destroy (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const destroyer = new EmpleadoService()
}
