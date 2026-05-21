import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const remarkSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  addedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const complaintSchema = new mongoose.Schema({
  complaintId:  { type: String, default: () => nanoid(8).toUpperCase(), unique: true },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:     { type: String, required: true },
  description:  { type: String, required: true, minlength: 20 },
  location:     { type: String, default: '' },
  coordinates:  {
    lat: { type: Number },
    lng: { type: Number },
  },
  imageUrl:     { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'open', 'assigned', 'inprogress', 'resolved', 'closed'],
    default: 'pending',
  },
  department:   { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  assignedAt:   { type: Date },
  inProgressAt: { type: Date },
  resolvedAt:   { type: Date },
  remarks:      [remarkSchema],
}, { timestamps: true })

export default mongoose.model('Complaint', complaintSchema)
