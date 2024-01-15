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

export async function bitacora (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_justificacion } = req.params

  const finder = new JustificantesService()
  try {
    const bitacora = await finder.findBitacora(Number(id_justificacion))

    res.json(bitacora)
  } catch (error: any) {
    logger.error('Error al obtener la bitacora: ', error)
    next(error)
  }
}

export async function diasPermitidos (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new JustificantesService()
  try {
    const diasPermitidos = await finder.findDiasPermitidos()

    res.json(diasPermitidos)
  } catch (error: any) {
    logger.error('Error al obtener los dias permitidos: ', error)
    next(error)
  }
}

export async function tipoCaptura (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new JustificantesService()
  try {
    const tipoCaptura = await finder.findTipoCaptura()

    res.json(tipoCaptura)
  } catch (error: any) {
    logger.error('Error al obtener el tipo de captura: ', error)
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

export async function tenant (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new JustificantesService()
  try {
    const tenant = await finder.findTenant()

    res.json(tenant)
  } catch (error: any) {
    logger.error('Error al obtener el tenant: ', error)
    next(error)
  }
}

export async function evidencia (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_justificacion } = req.params

  const finder = new JustificantesService()
  try {
    const evidencia = await finder.findEvidencia(Number(id_justificacion))

    res.json(evidencia)
  } catch (error: any) {
    logger.error('Error al obtener la evidencia: ', error)
    next(error)
  }
}

export async function fechaInicio (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_cia } = req.user!

  const finder = new JustificantesService()
  try {
    const fechaInicio = await finder.findFechaInicio(id_cia)

    res.json(fechaInicio)
  } catch (error: any) {
    logger.error('Error al obtener la fecha de inicio: ', error)
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

export async function storeEvidencia (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_justificacion, referencia_evidencia } = req.body

  const creator = new JustificantesService()

  try {
    const evidencia = await creator.storeEvidencia(Number(id_justificacion), referencia_evidencia)

    res.json(evidencia)
  } catch (error: any) {
    logger.error('Error al crear la evidencia: ', error)
    next(error)
  }
}

export async function destroy (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_justificacion } = req.params

  const deleter = new JustificantesService()

  try {
    const justificante = await deleter.destroy(Number(id_justificacion))

    res.json(justificante)
  } catch (error: any) {
    logger.error('Error al eliminar el justificante: ', error)
    next(error)
  }
}
