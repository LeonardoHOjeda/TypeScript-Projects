import { Router } from 'express'
import * as ahorroController from './ahorro.controller'
import { storeValidators, updateValidators } from './ahorro.validator'

const router = Router()

router.get('/', ahorroController.index)
//
router.get('/:id', ahorroController.show)
//
router.post('/', storeValidators, ahorroController.store)
//
router.put('/:id', updateValidators, ahorroController.update)
//
router.delete('/:id', ahorroController.destroy)

export default router
