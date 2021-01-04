export {}
const express = require("express")
const validUrl = require("valid-url")
const shortid = require("shortid")
const config = require("config")

const Url = require("../models/Url")

const router = express.Router()

router.post("/shorten", async (req: any, res: any) => {
	const { longUrl } = req.body
	const baseUrl = config.get("baseUrl")

	if (!validUrl.isUri(baseUrl)) {
		return res.status(401).json("Invalid base url")
	}

	const urlCode = shortid.generate()

	if (validUrl.isUri(longUrl)) {
		try {
			let url = await Url.findOne({ longUrl })
			if (url) {
				res.json(url)
			} else {
				const shortUrl = `${baseUrl}/${urlCode}`
				url = new Url({
					longUrl,
					shortUrl,
					urlCode,
					date: new Date(),
				})

				await url.save()
				res.json(url)
			}
		} catch (err) {
			console.error(err)
			res.status(500).json("Server Error")
		}
	} else {
		res.status(401).json("Invalid Long URL")
	}
})
module.exports = router
