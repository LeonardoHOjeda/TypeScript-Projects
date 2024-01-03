import { Router } from 'express'
import * as justificantesController from './justificantes.controller'

const router = Router()

router.get('/', justificantesController.justificantes)
//
router.post('/', justificantesController.store)
//
router.get('/incidencias', justificantesController.incidencias)
//
router.get('/incapacidades', justificantesController.incapacidades)
//
router.get('/dias', justificantesController.diasPermitidos)
//
router.get('/captura', justificantesController.tipoCaptura)
//
router.delete('/:id_justificacion', justificantesController.destroy)
//
router.get('/bitacora/:id_justificacion', justificantesController.bitacora)

export default router
