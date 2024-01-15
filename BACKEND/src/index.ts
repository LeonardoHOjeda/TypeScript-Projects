import './alias'
import 'reflect-metadata'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import logger from './helpers/logger'
import routes from './router'
import { rateLimiterMiddleware } from './middlewares/rate_limiter'
import { settings } from './config/settings'
import { handleErrorMiddleware } from './middlewares/error_handler'
import { AppDataSource } from './database/datasources'
import passport from 'passport'
import { JWTStrategy } from './middlewares/passport'

export class App {
  public app: express.Application

  constructor () {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.app.use(
      morgan('[:date[iso]] (:status) ":method :url HTTP/:http-version" :response-time ms - [:res[content-length]]')
    )
    this.app.use(cors({ origin: '*' }))
    this.app.use(rateLimiterMiddleware)
    this.app.use(helmet())
    this.app.use(express.json())
    this.app.use(express.static('public'))
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(passport.initialize())
    passport.use('jwt', JWTStrategy)
  }

  routes () {
    this.app.use(routes)
    this.app.use(handleErrorMiddleware)
    this.app.use('*', (req, res) => {
      res.sendFile('index.html', { root: './public' })
    })
  }

  start () {
    AppDataSource.initialize()
      .then(() => {
        logger.info('📦 Database initialized')
      })
      .catch((err) => console.log('Error db: ', err))
    this.app.listen(settings.PORT, () => {
      logger.info(`🚀 Server listen on port ${settings.PORT}`)
    })
  }
}

const app = new App()
export const server = app.start()
