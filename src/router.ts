import { Router } from 'express'
import { authenticate } from './middlewares/passport'
import empleadoRouter from '@/modules/empleado/empleado.routes'
import authRouter from '@/modules/auth/auth.routes'
import cardexRouter from '@/modules/cardex/cardex.routes'
import prestamoRouter from '@/modules/prestamo/prestamo.routes'
const router = Router()

// importing all routes here
router.get('/', (req, res) => {
  return res.json({ Hello: 'World' })
})
router.use('/api/auth', authRouter)
router.use('/api/empleados', authenticate, empleadoRouter)
router.use('/api/cardex', authenticate, cardexRouter)
router.use('/api/prestamos', authenticate, prestamoRouter)

export default router
