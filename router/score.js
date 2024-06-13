const express = require('express');
const router = express.Router();
const db = require('../db/index');
const {auth} = require("../middleware/auth");


router.get('/courses/:course_id', async (req, res) => {
    const {course_id} = req.params;
    const [scores] = await db.query(`
    select stu.name, cls.date, cls.session, sc.score
    from score sc
    join student stu on stu.id = sc.student_id
    join class cls ON cls.id = sc.class_id
    where sc.course_id = ?
    `, [course_id]);
    res.send(scores);
});

router.get('/courses/:course_id/classes/:class_id', auth, async (req, res) => {
    const {class_id} = req.params;
    const [scores] = await db.query(`
    select student_id, score
    from score
    where class_id=?`, [class_id])
    res.send(scores);
})

router.post('/courses/:course_id/classes/:class_id/students/:student_id', auth, async (req, res) => {
    const { score } = req.body;
    const { course_id, class_id, student_id } = req.params;
    if (typeof score !== 'number') {
        return res.status(400).send({ code: 1, message: 'Score must be a number.' });
    }
    try {
        // 检查是否已有分数记录
        const [existingScores] = await db.query(`
            SELECT score
            FROM score
            WHERE course_id = ? AND class_id = ? AND student_id = ?
        `, [course_id, class_id, student_id]);

        if (existingScores.length > 0) {
            // 如果已有记录，更新分数
            const newScore = existingScores[0].score + score;
            await db.execute(`
                UPDATE score
                SET score = ?
                WHERE course_id = ? AND class_id = ? AND student_id = ?
            `, [newScore, course_id, class_id, student_id]);
            res.send({ code: 0, message: 'Score updated successfully.' });
        } else {
            // 如果没有记录，插入新的分数
            await db.execute(`
                INSERT INTO score (course_id, class_id, student_id, score)
                VALUES (?, ?, ?, ?)`,
                [course_id, class_id, student_id, score]
            );
            res.send({ code: 0, message: 'Score inserted successfully.' });
        }
    } catch (error) {
        console.error('Error inserting or updating score:', error);
        res.status(500).send({ code: -1, message: 'Failed to insert or update score.' });
    }
})

router.patch('/change/courses/:course_id/classes/:class_id/students/:student_id', auth, async (req, res) => {
    const {class_id, student_id} = req.params;
    const {score } = req.body
    await db.execute(`
    update score
    set score=?
    where student_id=? and class_id=?`, [score, student_id, class_id])
    res.send({code: 0});
})
module.exports = router;
