import { bodyValidator } from '@/middlewares/validator'
import { check } from 'express-validator'

export const loginValidators = [
  check('username').notEmpty().withMessage('El campo \'nombre de usuario\' es obligatorio'),
  check('password').notEmpty().withMessage('El campo \'contraseña\' es obligatorio'),
  bodyValidator
]
