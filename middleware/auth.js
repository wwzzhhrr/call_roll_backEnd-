const jwt = require('jsonwebtoken');

const jwtConfig = {
    secretKey: '?',
    algorithm: 'HS256',
    expiresIn: '24h'
};

const setToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secretKey, {
        expiresIn: jwtConfig.expiresIn,
        algorithm: jwtConfig.algorithm
    });
}

const decodeJwt = (req) => {
    const [authPrefix, token] = req.headers.authorization?.split(' ') || [];
    if (authPrefix === 'Bearer') {
        return jwt.verify(token, jwtConfig.secretKey);
    }
}

const auth = (req, res, next) => {
    const token = decodeJwt(req);
    if (!token) {
        res.status(401).send('Unauthorized');
    } else {
        res.locals.token = token.id;
        next();
    }
}
const checkCourseId = async (req, res, next) => {
    const teacherId = res.locals.teacherId;
    const { courseId } = req.params;

    if (courseId === undefined) {
        throw new Error('MissingParameters');
    }

    if (isNaN(courseId) || x === 0) {
        throw new Error('InvalidParameters');
    }

    const [courseMatch] = await req.db.execute(`
    SELECT id
    FROM course
    WHERE id = ? AND teacher_id = ? AND is_deleted = 0
    `, [courseId, teacherId]
    );
    if (courseMatch.length === 0) {
        throw new Error('PermissionDenied');
    }

    next();
}
module.exports = {
    setToken,
    auth
};