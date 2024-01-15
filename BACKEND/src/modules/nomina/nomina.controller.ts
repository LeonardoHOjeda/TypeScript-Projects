import { NextFunction, Request, Response } from 'express'
import { nominaService } from './services'

export async function index (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = nominaService.findAll()
}

/**
 * Return one instance of entity
 * @param req
 * @param res
 * @param next
 */
export async function show (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params
  const finder = nominaService.findOne(id)
}
