import { Router } from 'express'
import { getStats } from '../controllers/analyticsController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/stats', protect, authorize('admin'), getStats)
export default router
