import { NextFunction, Request, Response } from 'express'
import { JustificantesService } from './services'
import logger from '@/helpers/logger'

export async function justificantes (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!

  const finder = new JustificantesService()
  try {
    const justificantes = await finder.findAll(id_emp)

    res.json(justificantes)
  } catch (error: any) {
    logger.error('Error al obtener los justificantes: ', error)
    next(error)
  }
}

export async function incidencias (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new JustificantesService()
  try {
    const incidencias = await finder.findIncidencias()

    res.json(incidencias)
  } catch (error: any) {
    logger.error('Error al obtener las incidencias: ', error)
    next(error)
  }
}

export async function incapacidades (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new JustificantesService()
  try {
    const incapacidades = await finder.findIncapacidades()

    res.json(incapacidades)
  } catch (error: any) {
    logger.error('Error al obtener las incapacidades: ', error)
    next(error)
  }
}

export async function store (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const body = req.body

  const creator = new JustificantesService()

  try {
    const justificante = await creator.store(id_emp, body)

    res.json(justificante)
  } catch (error: any) {
    logger.error('Error al crear el justificante: ', error)
    next(error)
  }
}
