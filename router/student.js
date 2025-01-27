const express = require("express");
const router = express.Router();
const db = require("../db/index");
const { auth } = require("../middleware/auth");

router.get("/studentCourse/:course_id", auth, async (req, res) => {
  try {
    const course_id = req.params;
    const result = await db.query(
      `SELECT * FROM student WHERE course_id = ? and is_deleted = 0`,
      [course_id],
    );
    res.send(result[0]);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/addStudents/:course_id", auth, async (req, res) => {
  const course_id = req.params.course_id;
  const { name: studentName } = req.body;
  await db.execute(`INSERT INTO student(name, course_id) values(?, ?)`, [
    studentName,
    course_id,
  ]);
  res.json({ code: 0 });
});

router.delete('/:courseId/students/:studentId', auth, async (req, res) => {
  // const { courseId, studentId } = req.params;
  const { courseId, studentId } = req.params;

  await db.execute(
        `UPDATE student
      SET is_deleted = 1 
      WHERE id = ? AND is_deleted = 0 AND course_id = ?`, [ studentId, courseId]);
    res.send({code: 0});
})

router.get('/is_call/:student_id/:course_id', auth, async (req, res) => {
  const { student_id, course_id } = req.params;
  await db.execute(`
  UPDATE student
  SET is_call = 1
  WHERE id = ? and course_id = ?;`, [ student_id, course_id ])
  res.send({code: 0});
})
router.get('/recall/:course_id', auth, async (req, res) => {
  const { course_id } = req.params;
  await db.execute(`
  UPDATE student
  SET is_call = 0
  WHERE course_id = ?;`, [ course_id ])
  res.send({code: 0});
})
router.post('/is_come/:student_id/:course_id', auth, async (req, res) => {
    const { student_id, course_id } = req.params;
    const { isCome } = req.body;

    // 验证 isCome 值
    if (isCome !== 0 && isCome !== 1) {
        return res.status(400).send({ code: 1, message: 'isCome must be 0 or 1.' });
    }

    try {
        await db.execute(`
            UPDATE student
            SET is_come = ?
            WHERE course_id = ? AND id = ?;
        `, [isCome, course_id, student_id]);

        res.send({ code: 0, message: 'Student attendance status updated successfully.' });
    } catch (error) {
        console.error('Error updating student attendance status:', error);
        res.status(500).send({ code: -1, message: 'Failed to update student attendance status.' });
    }
});

module.exports = router;

