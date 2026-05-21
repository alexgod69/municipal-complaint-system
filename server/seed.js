import User from './models/User.js'
import Department from './models/Department.js'
import Complaint from './models/Complaint.js'

export async function seedIfEmpty() {
  const count = await User.countDocuments()
  if (count > 0) return

  console.log('Seeding demo data...')

  const departments = await Department.insertMany([
    { name: 'Roads & Infrastructure', description: 'Road repair, potholes, footpaths',   categories: ['Road Repair'] },
    { name: 'Sanitation & Waste',     description: 'Garbage collection and disposal',     categories: ['Garbage Collection', 'Public Toilet Maintenance'] },
    { name: 'Water Supply',           description: 'Water supply and drainage',           categories: ['Water Supply', 'Drainage Issues'] },
    { name: 'Electricity',            description: 'Street lights and power issues',      categories: ['Street Light Problems'] },
    { name: 'Enforcement',            description: 'Illegal construction and pollution',  categories: ['Illegal Construction', 'Pollution Complaints'] },
  ])

  const admin = await User.create({
    name: 'Admin User', email: 'admin@mcms.com', password: 'Admin@123', role: 'admin',
  })
  const deptUser = await User.create({
    name: 'Roads Officer', email: 'roads@mcms.com', password: 'Roads@123',
    role: 'department', department: departments[0]._id,
  })
  const citizen = await User.create({
    name: 'Rahul Sharma', email: 'rahul@example.com', password: 'Rahul@123',
    role: 'citizen', phone: '+91 98765 43210',
  })

  await Complaint.insertMany([
    {
      user: citizen._id, category: 'Road Repair',
      description: 'There is a large pothole near the main market intersection that has been causing accidents. Immediate repair is needed.',
      location: 'Main Market, Ward 5', status: 'assigned',
      department: departments[0]._id, assignedAt: new Date(),
    },
    {
      user: citizen._id, category: 'Garbage Collection',
      description: 'Garbage has not been collected for the past 5 days in our locality. The street is overflowing with waste and smells terrible.',
      location: 'Sector 12, Block B', status: 'inprogress',
      department: departments[1]._id, assignedAt: new Date(), inProgressAt: new Date(),
    },
    {
      user: citizen._id, category: 'Street Light Problems',
      description: 'The street light at the corner of MG Road and Park Avenue has been out for 2 weeks. It poses a serious safety risk at night.',
      location: 'MG Road & Park Ave junction', status: 'resolved',
      department: departments[3]._id, assignedAt: new Date(), inProgressAt: new Date(), resolvedAt: new Date(),
    },
    {
      user: citizen._id, category: 'Water Supply',
      description: 'No water supply for the last 3 days in our area. Residents are struggling to manage daily needs.',
      location: 'Anand Nagar Colony', status: 'pending',
    },
    {
      user: citizen._id, category: 'Drainage Issues',
      description: 'Drain near the bus stop is blocked causing water to overflow onto the road during rain.',
      location: 'Bus Stop, Ward 7', status: 'open',
    },
  ])

  console.log('Demo data seeded:')
  console.log('  admin@mcms.com    / Admin@123')
  console.log('  roads@mcms.com    / Roads@123')
  console.log('  rahul@example.com / Rahul@123')
}
