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
    const { score } = req.body
    const { course_id, class_id, student_id } = req.params;
    await db.execute(`
    insert into score(course_id, class_id, student_id, score)
    values(? , ?, ?, ?)`, [course_id, class_id, student_id, score])
    res.send({code: 0});
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
