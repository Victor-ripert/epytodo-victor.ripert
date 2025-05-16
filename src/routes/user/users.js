const express = require('express');
const mysql = require('mysql2');
const db = require('../../config/db');
const bcryptjs = require('bcryptjs')
const { route } = require('./user');

const router = express.Router();

router.use(express.json())

module.exports = router;

router.get("/:element", (req, res) => {
    const element = (req.params.element);
    const id = Number(element);
    if (!id) {
        db.query(`SELECT id, email, password, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, firstname, name FROM user WHERE email = '${ element }';`, (err, result) => {
            if (err) throw err;
            if (!result[0]) return res.status(400).json({ msg: "Not found" });
            return res.status(200).json({"id" : result[0].id, "email" : result[0].email, "password" : result[0].password, "created_at" : result[0].created_at, "firstname" : result[0].firstname, "name" : result[0].name});
        })
    } else {
        db.query(`SELECT id, email, password, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, firstname, name FROM user WHERE id = '${ id }'`, (err, result) => {
            if (err) throw err;
            if (!result[0]) return res.status(400).json({ msg: "Not found" });
            return res.status(200).json({"id" : result[0].id, "email" : result[0].email, "password" : result[0].password, "created_at" : result[0].created_at, "firstname" : result[0].firstname, "name" : result[0].name});
        })
    }
})

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const {email, password, firstname, name} = req.body;
    if (!id || !email || !password || !firstname || !name)
        return res.status(400).json({ msg: "Bad parameter" });
    db.query(`SELECT COUNT(*) AS count FROM user WHERE email = '${ email }';`, (err, result) => {
        if (err) throw err;
        if (result[0].count != 0)
            return res.status(400).json({ msg: "Account alredy exists" });
    })
    bcryptjs.genSalt(12, (err, salt) => {
        if (err) throw err;
        bcryptjs.hash(password, salt, (err, hash) => {
            if (err) throw err;
            db.query(`UPDATE user SET email = '${ email }',  password = '${ hash }',  firstname = '${ firstname }',  name = '${ name }' WHERE id = ${ id }`, (err, result) => {
                if (err) throw err;
                if (result.changedRows > 0) return res.status(400).json({ msg: "Not found" });
            })
        })
    })
    db.query(`SELECT id, email, password, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, firstname, name FROM user WHERE id = ${ id }`, (err, result) => {
        if (err) throw err;
        return res.status(200).json({"id" : result[0].id, "email" : result[0].email, "password" : result[0].password, "created_at" : result[0].created_at, "firstname" : result[0].firstname, "name" : result[0].name});
    })
})

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.status(400).json({ msg: "Bad parameter" });
    db.query(`DELETE FROM user WHERE id = ${ id }`, (err, result) => {
        if (err) throw err;
        if (result.affectedRows < 1)
            return res.status(400).json({ msg: "Not found" });
        return res.status(200).json({ msg: `Successfully deleted record number: ${id}` })
    })
})