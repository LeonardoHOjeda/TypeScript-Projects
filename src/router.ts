import { Router } from 'express'
import empleadoRouter from '@/modules/empleado/empleado.routes'
import authRouter from '@/modules/auth/auth.routes'
const router = Router()

// importing all routes here
router.get('/', (req, res) => {
  return res.json({ Hello: 'World' })
})
router.use('/api/auth', authRouter)
router.use('/api/empleados', empleadoRouter)

export default router
