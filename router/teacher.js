const express = require('express');
const router = express.Router();
const db = require('../db/index');




const { setToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {

    await db.execute(`
    insert into teacher(username, password)
    values(?, ?)`, [username, password])
} catch (error) {
        console.log(error)
    }
    res.json({ code: 0 })
})
router.post ('/login',async (req, res) => {
    const { username, password } = req.body;

    let [user] = await db.execute(
        'SELECT * FROM `teacher` WHERE `username`=? AND `password`=?',
        [username, password]
    )

    if (user.length > 0) {
        res.send({ code: 0, token: setToken({ id: user[0].id }) });
    } else {
        res.status(404)
        res.send('Incorrect username or password');
    }
})

const { auth } = require('../middleware/auth');
router.get('/', auth, (req, res) => {
    const teacherId = res.locals.token
    res.send(`${teacherId}`);
})

module.exports = router;
