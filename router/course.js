const {auth} = require("../middleware/auth")
const express = require('express');
const router = express.Router();
const mysql=require('mysql2')
const db = require('../db/index')


router.get(`/`, auth,async (req, res) => {
    try {
            const teacher_id = res.locals.token;
            const result = await db.query('SELECT * FROM course WHERE teacher_id=? and is_deleted = 0', [teacher_id]);
            res.send(result[0]);
    } catch (err) {
            res.status(500).send('Internal Server Error');
    }
});
router.post('/addCourse', auth, async (req, res) => {
    const teacher_id = res.locals.token;
    const { name: courseName } = req.body;
    try {
        await db.execute(`INSERT INTO course(name, teacher_id) values(?, ?)`, [courseName, teacher_id]);
        res.json({ code: 0 });
    } catch (error) {
        console.error('Error occurred while adding course:', error);
        res.status(500).json({ error: 'An error occurred while adding the course.' });
    }
})
router.delete('/:courseId', auth, async (req, res)=>{
    const courseId = req.params.token;
    try {
        await db.execute(`UPDATE course SET is_deleted = 1 WHERE id = ?`, [courseId]);
        res.json({code: 0});
    }
    catch (error) {
        console.error('Error occurred while adding course:', error);
        res.status(500).json({ error: 'An error occurred while adding the course.' });
    }
});



module.exports = router;