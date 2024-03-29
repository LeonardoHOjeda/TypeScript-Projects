import { Router } from 'express'
import * as empleadoController from './empleado.controller'
// import { updateValidators } from './empleado.validator'

const router = Router()

router.get('/', empleadoController.datosGenerales)
router.get('/foto', empleadoController.foto)
router.get('/menus', empleadoController.menus)
router.post('/reset', empleadoController.sendMail)
router.get('/verificar', empleadoController.verifyToken)

export default router
