const config = require("config")
const db = config.get("mongoURI")
const mongoose = require("mongoose")

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log("mongodb connected!")
	} catch (err) {
		console.error(err.message)
		process.exit(1) // 1 signifies a failure
	}
}

module.exports = connectDB
