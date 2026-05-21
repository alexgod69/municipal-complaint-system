import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema({
  name:            { type: String, required: true, unique: true, trim: true },
  description:     { type: String, default: '' },
  assignedOfficer: { type: String, default: '' },
  categories:      [{ type: String }],
}, { timestamps: true })

export default mongoose.model('Department', departmentSchema)
