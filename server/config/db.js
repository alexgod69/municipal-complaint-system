import mongoose from 'mongoose'

const connectDB = async () => {
  let uri = process.env.MONGO_URI

  // If no external MongoDB, spin up an in-memory instance
  if (!uri || uri.includes('localhost')) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 })
      console.log('MongoDB connected (local)')
      return
    } catch {
      console.log('Local MongoDB unavailable — starting in-memory MongoDB...')
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      uri = mongod.getUri()
      process.env.MONGO_URI = uri
      console.log('In-memory MongoDB started')
    }
  }

  try {
    const conn = await mongoose.connect(uri)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB
