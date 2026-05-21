import Department from '../models/Department.js'

export const getDepartments = async (req, res) => {
  try {
    const depts = await Department.find().sort({ name: 1 })
    res.json(depts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body)
    res.status(201).json(dept)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(dept)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
