const teacherRouter = require('./teacher')
const courseRouter = require('./course')
const studentRouter = require('./student')
const scoreRouter = require('./score')
const attendance = require('./attendance')
const classes = require('./class')

module.exports = app => {
    app.use('/teacher', teacherRouter)
    app.use('/course', courseRouter)
    app.use('/student', studentRouter)
    app.use('/score', scoreRouter)
    app.use('/attendance', attendance)
    app.use('/class', classes)
}