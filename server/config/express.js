const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const logger = require('morgan');
const passport = require('passport');
const errorhandler 				= require('errorhandler');
const mongoose 				= require('mongoose');
const morgan 					= require('morgan');


var port     = process.env.PORT || 3000;
var isProduction = process.env.NODE_ENV === 'production';

var flash = require('connect-flash');



app.use(flash());




app.use(express.static('public'));
app.use('*/assets', express.static('public/assets'));

// connect to our database
if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/macrotec');
  mongoose.set('debug', true);
}
require('../models');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');




//rutas
app.use(require('../routes'));

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