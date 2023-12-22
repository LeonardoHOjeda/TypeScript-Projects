import { Router } from 'express'
import * as Controller from './nomina.controller'

const router = Router()

router.get('/', Controller.index)
//
router.get('/:id', Controller.show)

export default router
