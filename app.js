const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}))

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const router = require('./router');
router(app);

const port = 5050;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});