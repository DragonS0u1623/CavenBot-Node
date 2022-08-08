import mongoose from 'mongoose'

export async function mongo() {
    await mongoose.connect(process.env.MONGO_SRV,
    {
        keepAlive: true
    })
	return mongoose
}