const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');
const db = require('../../config/db');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true}));

router.post('/', (req, res) => {
    const {email, password} = req.body;
    if (!email, !password) {
        return res.status(400).json({msg: "Bad Parameters"})
    }
    db.query(`SELECT COUNT(*) AS count FROM user WHERE email = '${ email }';`, (err, result) => {
        if (err) throw err;
        if (result[0].count == 0) {
            return res.status(400).json({msg: "Invalid Credentials"});
        } else {
            db.query(`SELECT * FROM user WHERE email = '${ email }';`, (err, result) => {
                if (err) throw err;
                if (!result)
                    return res.status(400).json({msg: "Invalid Credentials"});
                bcryptjs.compare(password, result[0].password, (err, compare) => {
                    if (err) throw err;
                    if (compare == false) {
                        return res.status(400).json({msg: "Invalid Credentials"});
                    }
                    db.query(`SELECT * FROM user WHERE email = '${ email }'`, (err, id) => {
                        if (err) throw err;
                        if (!id) {
                            return res.status(400).json({msg: "Invalid Credentials"});
                        }
                        const token = jwt.sign({id: id[0].id}, process.env.SECRET);
                        return res.status(200).json({ "token": token });
                    })
                })
            })
        }
    })
})

module.exports = router;