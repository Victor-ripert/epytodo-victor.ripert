const express = require('express');
const mysql = require('mysql2');
const db = require('../../config/db');

const router = express.Router();

module.exports = router;

router.get("/", (req, res) => {
    const email = JSON.parse(atob(req.headers.authorization.split(' ')[1].split('.')[1])).email;
    db.query(`SELECT * FROM user WHERE email = '${ email }';`, (err, result) => {
        if (err) throw err;
        return res.status(200).json({"email" : result.email});
    })
})