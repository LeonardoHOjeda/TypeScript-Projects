import { Router } from 'express'
import * as vacacionesController from './vacaciones.controller'

const router = Router()

router.get('/:tipo', vacacionesController.index)

export default router
