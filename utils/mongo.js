const mongoose = require('mongoose')

module.exports = async () => {
    mongoose.connect(process.env.MONGO_SRV,
    {
        keepAlive: true
    })
	return mongoose
}