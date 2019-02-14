require('dotenv').config({path: __dirname + '/sample.env'});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes');
const config = require('./config');

const server = express();

const port = process.env.PORT; 

mongoose.connect(config.database, {useCreateIndex:true, useNewUrlParser: true});
mongoose.Promise = global.Promise;

server.use(express.static('public'));
server.set('view engine', 'ejs')
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(morgan('dev'));
server.use('/', router);

server.listen(port, () => {
    console.log(`listening on ${port}`);
});
