import { Router } from 'express'
import * as prestamoController from './prestamo.controller'

const router = Router()

router.get('/', prestamoController.index)

export default router
