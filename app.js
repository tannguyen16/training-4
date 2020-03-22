const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const db = require('./models');

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(async (req, res, next) => {
  const selectUsernameQuery = 'SELECT * FROM "Users" WHERE "Username" = :username';
  if (req.session && req.session.user && req.session.user.Username) { // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    const user = await db.sequelize.query(selectUsernameQuery, {
      replacements: { username: req.session.user.Username },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (user[0]) {
      req.user = user[0];
      delete req.user.Password; // delete the password from the session
      req.session.user = user[0]; // refresh the session value
      res.locals.user = user[0];
    }
    // finishing processing the middleware and run the route
    next();
  } else {
    next();
  }
});

app.use('/', index);
app.use('/user', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
