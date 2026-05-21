import { Router } from 'express'
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.use(protect, authorize('admin'))

router.get('/',     getAllUsers)
router.put('/:id',  updateUser)
router.delete('/:id', deleteUser)

export default router
