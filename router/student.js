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
  const { studentId } = req.params;

  await db.execute(
        `UPDATE student
      SET is_deleted = 1 
      WHERE id = ? AND is_deleted = 0`, [ studentId]);
    res.send({code: 0});
})
module.exports = router;
