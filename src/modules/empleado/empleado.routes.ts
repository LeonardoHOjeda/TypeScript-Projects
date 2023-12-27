import { Router } from 'express'
import * as empleadoController from './empleado.controller'
// import { updateValidators } from './empleado.validator'

const router = Router()

router.get('/', empleadoController.datosGenerales)

export default router
