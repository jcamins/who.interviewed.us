/*jshint node: true */
"use strict";

var path = require('path'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    morgan = require('morgan'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt'),
    restful = require('node-restful'),
    mongoose = restful.mongoose;

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" (:response-time ms)'));
app.use(session({ secret: 'd7c067b3868afdfaa87177c650a872006cdca049', resave: true, saveUninitialized: true, store: new MongoStore({ db: 'apptrack' }) }));

app.use(express.static(path.normalize(__dirname + '/app')));
app.use('/bower_components', express.static(path.normalize(__dirname + '/bower_components')));

mongoose.connect('mongodb://127.0.0.1:27017/apptrack');

var Interaction = mongoose.Schema({
    type: String,
    date: Date,
    person: String,
    feedback: String
});

var Application = restful.model('application', mongoose.Schema({
    company: String,
    position: String,
    recruiter: {
        company: String,
        person: String
    },
    interactions: [ Interaction ]
})).methods(['get', 'post', 'put', 'delete']);
Application.register(app, '/applications');

app.listen(10000, function () {
    console.log('Server started on port 10000');
});
