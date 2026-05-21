import Complaint from '../models/Complaint.js'
import User from '../models/User.js'

export const getStats = async (req, res) => {
  try {
    const [total, resolved, pending, users, byStatus, byCategory] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: { $in: ['pending', 'open', 'assigned'] } }),
      User.countDocuments({ role: 'citizen' }),
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ])
    res.json({ total, resolved, pending, users, byStatus, byCategory })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
