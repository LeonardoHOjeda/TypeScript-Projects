import { Router } from 'express'
import * as tiemposController from './tiempos.controller'

const router = Router()

router.get('/', tiemposController.index)
router.get('/periodos', tiemposController.periodos)

export default router
