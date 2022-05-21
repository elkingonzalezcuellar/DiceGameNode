const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride= require ('method-override');
const logger = require('morgan');
const  indexRouter = require('./routes/index.routes');
const  gameRouter= require('./routes/game.routes')
require('dotenv').config();


// Initilizations
const  app = express();
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");


//Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));



//Global Variables

//Routes
app.use(indexRouter);
app.use(gameRouter);
//Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const mongoose = require('mongoose');
const uri=`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.a0pnb.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

mongoose.connect(uri)
.then(()=>{console.log("DB Connected")})
.catch(e=>{console.log(e)});

app.use(express.json());
app.use(cookieParser());

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
