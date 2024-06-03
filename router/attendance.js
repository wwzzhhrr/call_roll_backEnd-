const express = require('express');
const router = express.Router();
const db = require('../db/index');
const {auth} = require("../middleware/auth")


router.get('/courses/:course_id', auth, async (req, res) => {
    const {course_id} = req.params;
    const [attendances] = await db.execute(`
    select stu.name, cls.date, cls.session, att.status
    from attendance att
    join student stu on stu.id = att.student_id
    JOIN class cls ON cls.id = att.class_id
    where att.course_id = ? and att.status != 0
    ORDER BY cls.date, cls.session`, [course_id])
    res.send(attendances);
});

router.get('/courses/:course_id/attendances/:class_id', auth, async (req, res) => {
    const {course_id} = req.params;
    const [attendances] = await db.execute(`
    select student_id, status
    from attendance
    where course_id=?`, [course_id])
    res.send(attendances);
});

router.post('/courses/:course_id/classes/:class_id/students/:student_id', auth, async (req, res) => {
    const { course_id, class_id, student_id } = req.params;
    const { status } = req.body;
    await db.execute(`
        insert into attendance(course_id, class_id, student_id, status)
        values(?, ?, ?, ?)
        `, [ course_id, class_id, student_id, status]
    )
    res.json({ code: 0 });
})

router.patch('/courses/:course_id/classes/:class_id/students/:student_id', auth, async (req, res) => {
    const { class_id, student_id} = req.params;
    const { status } = req.body;
    await db.execute(`
    update attendance
    SET status = ? 
    WHERE student_id = ? and class_id = ?`, [status, student_id, class_id])
    res.send({code: 0});
    }
)
module.exports = router;
