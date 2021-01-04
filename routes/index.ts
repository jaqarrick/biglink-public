export {}
const express = require("express")
const router = express.Router()
const Url = require("../models/Url")

router.get("/:code", async (req: any, res: any) => {
	try {
		const url = await Url.findOne({ urlCode: req.params.code })
		if (url) {
			return res.redirect(url.longUrl)
		} else {
			return res.status(404).json("No Url Found!")
		}
	} catch (err) {
		console.error(err)
		res.status(500).json("Server Error")
	}
})
module.exports = router
