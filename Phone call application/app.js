const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const basicRouter = require('./routes');
const app = express();
var cors = require('cors')

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', basicRouter);


app.listen(3000, function () {
    console.log('Listening to port 3000');
})