import { Router } from 'express'
import * as justificantesController from './justificantes.controller'

const router = Router()

router.get('/', justificantesController.justificantes)
//
router.get('/incidencias', justificantesController.incidencias)
//
router.get('/incapacidades', justificantesController.incapacidades)
export default router
