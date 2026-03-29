import { Router } from 'express'
import { moderate } from '../controllers/moderateController'

const router = Router()

router.post('/moderate', moderate)

export default router
