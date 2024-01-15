import passport from 'passport'
import { NextFunction, Request, Response } from 'express'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { settings } from '@/config/settings'
import { HTTPError, UnauthorizedError } from './error_handler'
import { Empleado } from '@/entities/empleados'

export const JWTStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      ExtractJwt.fromUrlQueryParameter('token')
    ]),
    secretOrKey: settings.SECRET
  },
  async (payload, done) => {
    try {
      const empleado = await Empleado.findOne({ where: { noempx: payload.noempx } })
      if (empleado == null) return done(null, false)
      return done(null, empleado)
    } catch (error) {
      done(error, false)
    }
  }
)

export const authenticate = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false }, (_error, user, info, status) => {
    if (info?.message === 'jwt expired') throw new HTTPError(401, 'Expired')

    if (user == null) throw new UnauthorizedError()

    req.user = user
    next()
  })(req, res, next)
