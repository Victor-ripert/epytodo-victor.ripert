const express = require('express')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const router = express.Router()
const db = require('../../config/db');

router.use(express.json())

router.get("/", (req, res) => {
    db.query('SELECT * FROM todo;', (err, result) => {
        if (err) throw err;
        return res.status(200).json({"id" : result[0].id, "title" : result[0].title, "description" : result[0].description, "created_at" : result[0].created_at, "due_time" : result[0].due_time, "user_id" : result[0].user_id, "status": result[0].status});
    })
})

router.post("/", (req, res) => {
    console.log(req.body.title);
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