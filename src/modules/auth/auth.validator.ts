import { bodyValidator } from '@/middlewares/validator'
import { check } from 'express-validator'

export const loginValidators = [
  check('username').notEmpty().withMessage('Field email is required'),
  check('password').notEmpty().withMessage('Field password is required'),
  bodyValidator
]
