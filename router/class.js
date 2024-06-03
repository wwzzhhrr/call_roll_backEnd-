const express = require('express');
const router = express.Router();
const db = require('../db/index');
const {auth} = require("../middleware/auth")


router.post("/:course_id", auth, async (req, res) => {
    const { course_id } = req.params;
    const { timestamp } = req.body;

    // 检查是否为有效的时间戳
    const parsedTimestamp = Number(timestamp);
    if (isNaN(parsedTimestamp) || parsedTimestamp < 0) {
        return res.status(400).json({ error: "Invalid timestamp" });
    }
    //错误处理
    let date, session;
    try {
        date = new Date(parsedTimestamp).toISOString().split('T')[0];
        session = new Date(parsedTimestamp).getHours() < 12 ? 0 : 1;
    } catch (error) {
        console.error('Error occurred while converting timestamp to date:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
        await db.execute(`
            INSERT INTO class(course_id, date, session)
            VALUES (?, ?, ?)`,
            [course_id, date, session]);
        res.json({ code: 0 });
    } catch (error) {
        console.error('Error occurred while adding course:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
