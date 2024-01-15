import { Router } from 'express'
import * as cardexController from './cardex.controller'
// import { storeValidators, updateValidators } from './cardex.validator'

const router = Router()

router.get('/llaves', cardexController.llaves)
router.get('/years', cardexController.cardexYears)

// Dynamic routes
router.get('/:year', cardexController.cardex)

export default router
