const express = require('express');
const mysql = require('mysql2');
const db = require('../../config/db');

const router = express.Router();

module.exports = router;

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