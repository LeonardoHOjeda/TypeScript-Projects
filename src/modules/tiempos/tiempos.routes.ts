import { Router } from 'express'
import * as tiemposController from './tiempos.controller'

const router = Router()

router.get('/', tiemposController.index)

export default router
