const express = require('express');
const mysql = require('mysql2');
const db = require('../../config/db');

const router = express.Router();

module.exports = router;

router.get("/", (req, res) => {
    const id = JSON.parse(atob(req.headers.authorization.split(' ')[1].split('.')[1])).id;
    db.query(`SELECT * FROM user WHERE id = '${ id }';`, (err, result) => {
        if (err) throw err;
        return res.status(200).json({"id" : result[0].id, "email" : result[0].email, "password" : result[0].password, "created_at" : result[0].created_at, "firstname" : result[0].firstname, "name" : result[0].name});
    })
})

router.get("/todos", (req, res) => {
    const id = JSON.parse(atob(req.headers.authorization.split(' ')[1].split('.')[1])).id;
    db.query(`SELECT * FROM todo WHERE user_id = ${ id }`, (err, result) => {
        if (err) throw err;
        return res.status(200).json(result[0]);
    })
})
