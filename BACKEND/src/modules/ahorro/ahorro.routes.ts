import { Router } from 'express'
import * as ahorroController from './ahorro.controller'

const router = Router()

router.get('/fechas', ahorroController.fechas)
//
router.get('/conceptos', ahorroController.conceptos)
//
router.get('/ahorro', ahorroController.ahorro)

export default router
