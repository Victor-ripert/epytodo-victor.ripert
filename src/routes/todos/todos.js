const express = require('express')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const router = express.Router()
const db = require('../../config/db');
const { parse } = require('dotenv');

router.use(express.json())

router.get("/", (req, res) => {
    db.query('SELECT id, title, description, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, DATE_FORMAT(due_time, "%Y-%m-%d %h:%i:%s") AS due_time, user_id, status FROM todo ;', (err, result) => {
        if (err) throw err;
        let array = [];
        for (let index = 0; index != result.length; index++) {
            array[index] = ({"id" : result[index].id, "title" : result[index].title, "description" : result[index].description, "created_at" : result[index].created_at, "due_time" : result[index].due_time, "user_id" : result[index].user_id, "status": result[index].status});
        }
        return res.status(200).json(array);
    })
})

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    db.query(`SELECT id, title, description, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, DATE_FORMAT(due_time, "%Y-%m-%d %h:%i:%s") AS due_time, user_id, status FROM todo WHERE id = '${ id }';`, (err, result) => {
        if (err) throw err;
        if (!result[0]) return res.status(400).json({ msg: "Not found" });
        return res.status(200).json({"id" : result[0].id, "title" : result[0].title, "description" : result[0].description,
             "created_at" : result[0].created_at, "due_time" : result[0].due_time, "user_id" : result[0].user_id, "status": result[0].status});
    })
})

router.post("/", (req, res) => {
    let {title, description, due_time, user_id, status} = req.body;
    if (!title || !description || !due_time || !user_id ) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    if (!status)
        status = "not started";
    db.query(`SELECT COUNT(*) AS count FROM user WHERE id = '${ user_id }';`,(err, result) => {
        if (err) throw err;
        if (!result[0].count)
            return res.status(400).json({ msg: "Bad parameter" });
        else {
            let query = 'INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [title, description, due_time, status, user_id], (err, result) => {
                if (err) throw err;
                db.query(`SELECT id, title, description, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, DATE_FORMAT(due_time, "%Y-%m-%d %h:%i:%s") AS due_time, user_id, status FROM todo WHERE id = '${ result.insertId }';`, (err, result) => {
                    if (err) throw err;
                    return res.status(200).json({"id" : result[0].id, "title" : result[0].title, "description" : result[0].description,
                         "created_at" : result[0].created_at, "due_time" : result[0].due_time, "user_id" : result[0].user_id, "status": result[0].status});
                })
            })
        }
    });
})

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const {title, description, due_time, user_id, status} = req.body;
    if (!title || !description || !due_time || !user_id) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    if (!status)
        status = "not started";
    db.query(`SELECT COUNT(*) AS count FROM user WHERE id = '${ user_id }';`, (err, result) => {
        if (err) throw err;
        if (!result[0].count)
            return res.status(400).json({ msg: "Bad parameter" });
    });
    db.query(`UPDATE todo SET title = '${ title }', description = '${ description }', due_time = '${ due_time }', user_id = '${ user_id }', status = '${ status }' WHERE id = ${ id }`, (err, result) => {
        if (err) throw err;
        db.query(`SELECT id, title, description, DATE_FORMAT(created_at, "%Y-%m-%d %h:%i:%s") AS created_at, DATE_FORMAT(due_time, "%Y-%m-%d %h:%i:%s") AS due_time, user_id, status FROM todo WHERE id = '${ id }'`, (err, result) => {
            if (err) throw err;
            return res.status(200).json({"id" : result[0].id, "title" : result[0].title, "description" : result[0].description,
                 "created_at" : result[0].created_at, "due_time" : result[0].due_time, "user_id" : result[0].user_id, "status" : result[0].status});
        })
    })
})

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    db.query(`SELECT COUNT(*) AS count FROM todo WHERE id = '${ id }';`, (err, result) => {
        if (err) throw err;
        console.log(result[0].count);
        if (!result[0].count)
            return res.status(400).json({ msg: "Not found" });
        let query = `DELETE FROM todo WHERE id = ${ id }`;
        db.query(query, (err, result) => {
        if (err) throw err;
            res.status(200).json({ msg: `Successfully deleted record number : ${ id }` });
    })
    })
})

module.exports = router;