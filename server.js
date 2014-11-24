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
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    bcrypt = require('bcrypt'),
    restful = require('node-restful'),
    mongoose = restful.mongoose;

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(morgan(':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" (:response-time ms)'));
app.use(session({ secret: 'd7c067b3868afdfaa87177c650a872006cdca049', resave: true, saveUninitialized: true, store: new MongoStore({ db: 'crystalSlipper' }) }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: '453793674030-o5gs3u80rddrdpf2u4tlmtsqnkuejl7s.apps.googleusercontent.com',
        clientSecret: '1_5ZqNUL5etywK4iqd0zHO2s',
        callbackURL: "http://localhost:10000/auth/google/return"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ username: profile.emails[0].value }, function (err, user) {
            if (err || user) {
                return done(err, user);
            } else {
                User.create({
                    username: profile.emails[0].value,
                    googleId: profile.id,
                    name: profile.displayName,
                    picture: profile._json.picture
                }, done);
            }
        });
    }));

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) { req.query.user = req.body.user = req.user.username; return next(); }
    return res.status(401).send({ });
}

app.use(express.static(path.normalize(__dirname + '/app')));
app.use('/bower_components', express.static(path.normalize(__dirname + '/bower_components')));
mongoose.connect('mongodb://127.0.0.1:27017/crystalSlipper');

var UserSchema = mongoose.Schema({
    username: String,
    googleId: String,
    name: String,
    picture: String,
    password: String
});
var User = mongoose.model('User', UserSchema);

var InterviewSchema = mongoose.Schema({
    type: String,
    date: Date,
    person: String,
    feedback: String
});

var Application = restful.model('application', mongoose.Schema({
    user: String,
    company: String,
    position: String,
    recruiter: {
        company: String,
        person: String
    },
    interviews: [ InterviewSchema ]
})).methods([ { method: 'get', before: loggedIn }, { method: 'post', before: loggedIn }, { method: 'put', before: loggedIn }, { method: 'delete', before: loggedIn }]);
Application.register(app, '/application');


app.get('/auth/user', loggedIn, function (req, res) {
    if (req.user.password) {
        delete req.user.password;
    }
    res.send(req.user);
});

app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/userinfo.email' }));

app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/#/login' }));

app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/#/login');
});

app.listen(10000, function () {
    console.log('Server started on port 10000');
});
