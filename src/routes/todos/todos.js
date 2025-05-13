const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("I Goon To Shrek")
    console.log(req.headers.authorization)
})

module.exports = router