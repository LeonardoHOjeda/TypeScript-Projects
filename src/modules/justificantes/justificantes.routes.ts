import { Router } from 'express'
import * as justificantesController from './justificantes.controller'
import { storeValidators } from './justificantes.validator'

const router = Router()

router.get('/', justificantesController.justificantes)
//
router.post('/', [...storeValidators], justificantesController.store)
//
router.get('/incidencias', justificantesController.incidencias)
//
router.get('/incapacidades', justificantesController.incapacidades)
//
router.get('/dias', justificantesController.diasPermitidos)
//
router.get('/captura', justificantesController.tipoCaptura)
//
router.get('/tenant', justificantesController.tenant)
//
router.get('/fecha', justificantesController.fechaInicio)
//
router.get('/evidencia/:id_justificacion', justificantesController.evidencia)

// TODO: Modificar la ruta, pasar el id_justificacion como parametro
router.post('/evidencia', justificantesController.storeEvidencia)
//
router.get('/bitacora/:id_justificacion', justificantesController.bitacora)
//
router.delete('/:id_justificacion', justificantesController.destroy)

export default router
