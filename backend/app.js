var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors')
const {isProduction} = require('./config/keys')

const csurf = require('csurf')

const debug = require('debug')

require('./models/User')
require('./models/Tweet')
require('./config/passport')
const passport = require('passport')

var usersRouter = require('./routes/api/users');
const tweetsRouter = require('./routes/api/tweets');
const csrfRouter = require('./routes/api/csrf');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

if (!isProduction) {

    app.use(cors());
  }

app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);


app.use('/api/users', usersRouter);
app.use('/api/tweets', tweetsRouter)
app.use('/api/csrf', csrfRouter)

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
  });

const serverErrorLogger = debug('backend:error');

app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      statusCode,
      errors: err.errors
    })
  });

module.exports = app;
