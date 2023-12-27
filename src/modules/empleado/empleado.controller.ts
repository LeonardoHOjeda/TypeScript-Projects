import { NextFunction, Request, Response } from 'express'
import { EmpleadoService } from './services'
import logger from '@/helpers/logger'

export async function datosGenerales (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp, noempx } = req.user!

  console.log('Id: ', id_emp)

  const finder = new EmpleadoService()
  try {
    const empleado = await finder.findOne(id_emp, noempx)

    res.json(empleado)
  } catch (error) {
    logger.error('Error al obtener el empleado autenticado')
    next(error)
  }
}

// export async function update (req: Request, res: Response, next: NextFunction): Promise<void> {
//   const { id } = req.params
//   const updater = new EmpleadoService()
// }
