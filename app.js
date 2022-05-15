var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('./passport.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountsRouter = require('./routes/accountsRouter');
var documentTypeRouter = require('./routes/documentTypesRouter');
var investmentStatementsRouter = require('./routes/investmentStatementsRouter');
var authRouter = require('./routes/auth.js');

const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/statements";

const connect = mongoose.connect(url);

connect.then(() => {
    console.log('Connected sucessfully to server');
}, (err) => {
    console.log(err);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


var allowedOrigins = ['http://localhost:3000',
                      'http://localhost:3001'];

app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
}));


function auth(req, res, next) {
    console.log(req.headers);

    var authHeader = req.headers.authorization;

    if(!authHeader) {
        // Client didn't add authorization header in the request
        var err = new Error('You are not authenticated');

        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;   // Unauthorized
        return next(err); 
    }

    var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');    // auth is going to be an array of length 2 [username, password]

    var username = auth[0];
    var password = auth[1];

    console.log('auth', auth)
    console.log('username', username)

    if(username === 'admin' && password === 'password') {
        next();
    }

    else {
        var err = new Error('You are not authenticated');

        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;   // Unauthorized
        return next(err); 
    }
}

// We want to add the authentication before any static page is served to the client
// app.use(auth);

// Serving static pages to the client
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/documentTypes', documentTypeRouter);
app.use('/investmentStatements', investmentStatementsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
