export {}
const express = require("express")
const path = require("path")
const app = express()
const normalizePort = (port: any) => parseInt(port, 10)
const PORT = normalizePort(process.env.PORT || 5000)
// const dev = app.get("env") !== "production"
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.resolve(__dirname, "client", "build")))
	app.get("/", (req: any, res: any) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	})
}

const connectDB = require("./config/db")
connectDB()
app.use(express.json()) // allows to accept json data into api

app.use("/", require("./routes/index"))
app.use("/api/url", require("./routes/url"))

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
