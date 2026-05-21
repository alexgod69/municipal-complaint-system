import Complaint from '../models/Complaint.js'
import Department from '../models/Department.js'

export const submitComplaint = async (req, res) => {
  try {
    const { category, description, location, lat, lng } = req.body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''
    const coordinates = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined
    const complaint = await Complaint.create({
      user: req.user._id, category, description, location, imageUrl, coordinates,
    })
    await complaint.populate('user', 'name email')
    res.status(201).json(complaint)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const getAllComplaints = async (req, res) => {
  try {
    const { status, limit = 50, page = 1, assigned } = req.query
    const filter = {}
    if (status) filter.status = status

    // Department users see only their assigned complaints
    if (req.user.role === 'department') {
      filter.department = req.user.department
    }

    const total = await Complaint.countDocuments(filter)
    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    res.json({ complaints, total, page: Number(page) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('department', 'name')
      .sort({ createdAt: -1 })
    res.json(complaints)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('department', 'name')
      .populate('remarks.addedBy', 'name role')

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' })

    // Citizens can only view their own
    if (req.user.role === 'citizen' && complaint.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' })

    res.json(complaint)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateComplaint = async (req, res) => {
  try {
    const { status } = req.body
    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) return res.status(404).json({ message: 'Not found' })

    if (status) {
      complaint.status = status
      if (status === 'inprogress' && !complaint.inProgressAt) complaint.inProgressAt = new Date()
      if (status === 'resolved' && !complaint.resolvedAt) complaint.resolvedAt = new Date()
    }
    await complaint.save()
    res.json(complaint)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const assignComplaint = async (req, res) => {
  try {
    const { departmentId } = req.body
    const dept = await Department.findById(departmentId)
    if (!dept) return res.status(404).json({ message: 'Department not found' })

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { department: departmentId, status: 'assigned', assignedAt: new Date() },
      { new: true }
    ).populate('department', 'name')

    res.json(complaint)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const addRemark = async (req, res) => {
  try {
    const { text } = req.body
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $push: { remarks: { text, addedBy: req.user._id } } },
      { new: true }
    )
    res.json(complaint)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
