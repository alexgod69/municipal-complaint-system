import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import {
  submitComplaint, getAllComplaints, getMyComplaints,
  getComplaintById, updateComplaint, assignComplaint,
  addRemark, deleteComplaint,
} from '../controllers/complaintController.js'
import { protect, authorize } from '../middleware/auth.js'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

const router = Router()
router.use(protect)

router.post('/',          authorize('citizen'), upload.single('image'), submitComplaint)
router.get('/',           authorize('admin', 'department'), getAllComplaints)
router.get('/mine',       authorize('citizen'), getMyComplaints)
router.get('/:id',        getComplaintById)
router.put('/:id',        authorize('admin', 'department'), updateComplaint)
router.put('/:id/assign', authorize('admin'), assignComplaint)
router.post('/:id/remarks', authorize('department', 'admin'), addRemark)
router.delete('/:id',     authorize('admin'), deleteComplaint)

export default router
