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
    next(error)
  }
}

export async function empresa (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new ReciboService()
  try {
    const empresa = await finder.findEmpresa()

    res.json(empresa)
  } catch (error: any) {
    logger.error('Error al obtener la empresa de la nomina: ', error)
    next(error)
  }
}

export async function registroPatronal (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new ReciboService()
  try {
    const registro = await finder.findRegistroPatronal()

    res.json(registro)
  } catch (error: any) {
    logger.error('Error al obtener el registro patronal de la nomina: ', error)
    next(error)
  }
}

export async function meses (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { year } = req.params
  const { id_emp } = req.user!
  const finder = new ReciboService()
  try {
    const meses = await finder.findMeses(Number(year), id_emp)

    res.json(meses)
  } catch (error: any) {
    logger.error('Error al obtener los meses de la nomina: ', error)
    next(error)
  }
}

export async function periodos (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { mes, year } = req.params
  const { id_emp } = req.user!
  const finder = new ReciboService()
  try {
    const periodos = await finder.findPeriodos(id_emp, Number(mes), Number(year))

    res.json(periodos)
  } catch (error: any) {
    logger.error('Error al obtener los periodos de la nomina: ', error)
    next(error)
  }
}

export async function percepciones (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { periodo } = req.params
  const id_periodo = periodo.split('-')[0]
  const finder = new ReciboService()
  try {
    const deducciones = await finder.findPercepciones(id_emp, Number(id_periodo))

    res.json(deducciones)
  } catch (error: any) {
    logger.error('Error al obtener las deducciones del periodo: ', error)
    next(error)
  }
}

export async function deducciones (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { periodo } = req.params
  const id_periodo = periodo.split('-')[0]
  const finder = new ReciboService()
  try {
    const deducciones = await finder.findDeducciones(id_emp, Number(id_periodo))

    res.json(deducciones)
  } catch (error: any) {
    logger.error('Error al obtener las deducciones del periodo: ', error)
    next(error)
  }
}
