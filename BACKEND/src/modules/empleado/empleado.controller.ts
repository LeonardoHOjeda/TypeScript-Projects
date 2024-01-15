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
  } catch (error: any) {
    logger.error('Error al obtener el empleado autenticado: ', error)
    next(error)
  }
}

export async function foto (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!

  const finder = new EmpleadoService()
  try {
    const foto = await finder.findImagen(id_emp)

    res.json(foto.toString('base64'))
  } catch (error: any) {
    logger.error('Error al obtener la foto del empleado: ', error)
    next(error)
  }
}

export async function menus (_req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new EmpleadoService()
  try {
    const menus = await finder.findMenus()

    res.json(menus)
  } catch (error: any) {
    logger.error('Error al obtener los menus: ', error)
    next(error)
  }
}

// TODO: Actualizar contrasena del empleado

//

export async function sendMail (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email } = req.body

  const finder = new EmpleadoService()
  try {
    await finder.sendPasswordResetEmail(email)

    res.status(204).end()
  } catch (error: any) {
    logger.error('Error al enviar el correo: ', error)
    next(error)
  }
}

// Pagina para verificar el token
export async function verifyToken (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { token } = req.query

  const finder = new EmpleadoService()
  try {
    await finder.verifyPasswordToken((token as string))

    // Regresar una pagina de exito
    res.send('Token verificado')
  } catch (error: any) {
    logger.error('Error al verificar el token: ', error)
    next(error)
  }
}
