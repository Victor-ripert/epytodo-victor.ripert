const express = require('express')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("I Goon To Shrek")
    console.log(req.headers.authorization)
})

router.post("/", (req, res) => {
    const {title, description, due_time, user_id, status} = req.body;
    if (!title || !description || !due_time || !user_id || !status) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    const created_at = (new Date());
    db.query(`INSERT INTO todo (title, description, created_at, due_time, status, user_id) VALUES (${ title }, ${ description }, ${ created_at }, ${ due_time }, ${ status }, ${ user_id })`, (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    })
})

module.exports = router;