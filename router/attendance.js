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
    res.json(attendances);
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
    try {
        const { course_id, class_id, student_id } = req.params;
        const { status } = req.body;

        // 验证status的有效性
        if (status < 0 || status > 3) {
            return res.status(400).json({ code: 1, message: 'Invalid status value' });
        }

        // 检查数据库中是否存在相同的记录
        const [[existingRecord]] = await db.execute(`
            SELECT * FROM attendance 
            WHERE course_id = ? AND class_id = ? AND student_id = ?
        `, [course_id, class_id, student_id]);

        if (existingRecord) {
            // 如果记录存在并且status相同，更新记录
            if (existingRecord.status !== status) {
                await db.execute(`
                    UPDATE attendance 
                    SET status = ? 
                    WHERE id = ?
                `, [status, existingRecord.id]);
            }
        } else {
            // 如果记录不存在，插入新记录
            await db.execute(`
                INSERT INTO attendance(course_id, class_id, student_id, status)
                VALUES(?, ?, ?, ?)
            `, [course_id, class_id, student_id, status]);
        }

        res.json({ code: 0 });

    } catch (error) {
        // 错误处理
        console.error('Error in attendance handling:', error);
        res.status(500).json({ code: 2, message: 'Internal server error' });
    }
});

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
