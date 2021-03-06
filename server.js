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
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    bcrypt = require('bcrypt'),
    restful = require('node-restful'),
    mongoose = restful.mongoose,
    bcrypt = require('bcrypt'),
    config = require('./config');

config.listenport = config.listenport || config.port || 10000;
config.listenhost = config.listenhost || '0.0.0.0';

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

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(morgan(':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" (:response-time ms)'));
app.use(session({ secret: config.session.secret, resave: true, saveUninitialized: true, store: new MongoStore({ db: config.session.db }) }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.username);
});
passport.deserializeUser(function(username, done) {
    User.findOne({ username: username }, done);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { error: { badcredentials: true } });
            }
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) return done(err);
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, { error: { badcredentials: true } });
                }
            });
        });
    }
));

passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: (config.protocol || 'http') + '://' + config.host + (config.port ? ':' + config.port : '') + "/auth/google/return"
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
    if (req.isAuthenticated()) { req.query.user = req.body.user = req.user; return next(); }
    return res.status(401).send({ });
}

app.use(express.static(path.normalize(__dirname + '/app')));
app.use('/bower_components', express.static(path.normalize(__dirname + '/bower_components')));
mongoose.connect(config.database);

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
    User.findOne({ username: req.user.username }, function (err, user) {
        if (err) {
            res.status(401).send({ error: { system: err } });
        } else if (user) {
            if (user.password) {
                delete user.password;
            }
            res.send(user);
        } else {
            res.status(401).send({ error: { nouser: true } });
        }
    });
});

app.post('/auth/user', function (req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.status(401).send({ error: { system: err } });
        } else if (user) {
            res.status(403).send({ error: { userexists: true } });
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) return res.send({ error: { system: err } });
                bcrypt.hash(req.body.password, salt, function (err, password) {
                    if (err) return res.send({ error: { system: err } });
                    user = new User({
                        name: req.body.name,
                        username: req.body.username,
                        password: password
                    });
                    user.save();
                    req.login(user, function (err) {
                        if (err) return res.send({ error: { system: err } });
                        res.send({ success: true });
                    });
                });
            });
        }
    });
});

app.put('/auth/user', loggedIn, function (req, res) {
    if (req.body.username !== req.user) return res.status(401).send({ error: { unauthorized: true } });
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.status(401).send({ error: { system: err } });
        } else if (user === null) {
            res.status(401).send({ error: { nouser: true } });
        } else {
            user.name = req.body.name || user.name;
            user.password = req.body.password || user.password;
            user.save();
            res.send({ success: true });
        }
    });
});

app.post('/auth/login', passport.authenticate('local'), function (req, res) {
    res.send({ success: true });
});

app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/userinfo.email' }));

app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/#/applications', failureRedirect: '/#/login' }));

app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/#/login');
});

app.listen(config.listenport, config.listenhost, function () {
    console.log('Server started on port ' + config.listenport);
});
