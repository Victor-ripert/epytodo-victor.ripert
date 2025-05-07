const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true}))

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

connection.connect((err) => {
    if (err) throw err;
        console.log("Connected successfully to the database (bien joué bogoss)")
})

router.post("/", (req, res) => {
    const {email, name, firstname, password} = req.body
  //      res.send([email, name, firstname, password])
        // res.json({ msg: "Bad parameter" })
})

module.exports = router