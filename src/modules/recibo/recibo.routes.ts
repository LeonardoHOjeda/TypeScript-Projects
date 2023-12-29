import { Router } from 'express'
import * as reciboController from './recibo.controller'
import { storeValidators, updateValidators } from './recibo.validator'

const router = Router()

router.get('/years', reciboController.years)
//
router.get('/:id', reciboController.show)
//
router.post('/', storeValidators, reciboController.store)
//
router.put('/:id', updateValidators, reciboController.update)
//
router.delete('/:id', reciboController.destroy)

export default router
