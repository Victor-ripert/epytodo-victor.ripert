const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send('neuille')
})

module.exports = router