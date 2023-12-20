import { Router } from 'express'
import * as authController from './auth.controller'
import { loginValidators } from './auth.validator'

const router = Router()

router.post('/login', [...loginValidators], authController.login)

export default router
