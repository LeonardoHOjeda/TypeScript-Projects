import { Router } from 'express'
import * as prestamoController from './prestamo.controller'

const router = Router()

router.get('/', prestamoController.index)
router.get('/:id', prestamoController.show)

export default router
