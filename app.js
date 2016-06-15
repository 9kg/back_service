var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

var promoter = require('./routes/promoter');

app.listen(9211);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin','*');
    next();
});

app.use('/promoter',promoter);

module.exports = app;