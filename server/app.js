const express = require('express');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./db/models');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send();
});
app.use('/api/authors', require('./db/routes/authors'));
app.use('/api/blogs', require('./db/routes/blogs'));

module.exports = app;
