import { Router } from 'express'
import * as reciboController from './recibo.controller'

const router = Router()

router.get('/', reciboController.recibosData)
//
router.get('/years', reciboController.years)
//
router.get('/empresa', reciboController.empresa)
//
router.get('/registro', reciboController.registroPatronal)
//
router.get('/recibo', reciboController.recibo)
//
router.get('/meses/:year', reciboController.meses)
//
router.get('/periodos/:mes/:year', reciboController.periodos)
//
router.get('/percepciones/:periodo', reciboController.percepciones)
//
router.get('/deducciones/:periodo', reciboController.deducciones)

export default router
