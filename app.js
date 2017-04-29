console.log('Init batch converter');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var cronController = require('./controllers/cronController');
var cronProvider = require('./providers/cronProvider');

cronProvider.startJobVox();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cronController);


app.listen(process.env.PORT || 3001);