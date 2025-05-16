const express = require('express');
const mysql = require('mysql2');
const db = require('../../config/db');

const router = express.Router();

module.exports = router;

router.get("/", (req, res) => {
    const id = JSON.parse(atob(req.headers.authorization.split(' ')[1].split('.')[1])).id;
    db.query(`SELECT * FROM user WHERE id = '${ id }';`, (err, result) => {
        if (err) throw err;
        if (!result[0]) return res.status(400).json({ msg: "Not found" });
        return res.status(200).json({"id" : result[0].id, "email" : result[0].email, "password" : result[0].password, "created_at" : result[0].created_at, "firstname" : result[0].firstname, "name" : result[0].name});
    })
})

router.get("/todos", (req, res) => {
    const id = JSON.parse(atob(req.headers.authorization.split(' ')[1].split('.')[1])).id;
    db.query(`SELECT id, title, description, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, DATE_FORMAT(due_time, "%Y-%m-%d %h:%i:%s") AS due_time, user_id, status FROM todo WHERE user_id = '${ id }';`, (err, result) => {
        if (err) throw err;
        let list_of_todos = [];
        for (let i = 0; result[i]; i++)
            list_of_todos.push(result[i])
        return res.status(200).json(list_of_todos);
    })
})
