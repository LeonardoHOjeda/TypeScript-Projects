import { NextFunction, Request, Response } from 'express'
import { AuthService } from './services/auth.service'

export async function login (req: Request, res: Response, next: NextFunction): Promise<void> {
  const authService = new AuthService()

  const body = req.body

  try {
    const user = await authService.login(body.username, body.password)

    res.json(user)
  } catch (error) {
    next(error)
  }
}
