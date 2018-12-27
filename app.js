const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
const db = mongoose.connection;

// Check for DB errors
db.on('error', function(err){
  console.log(err);
})

// Connection Check
db.once('open', function(){
  console.log("DB Connection Successful");
})

// App Init
const app = express();

// Include User Model
const Article = require('./models/users');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Specify Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'pancake boat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Homepage Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }else {
    res.render('index', {
      title: 'Homepage',
      articles: articles
    });
    }
  });
});

// Passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Route files
const articles = require('./routes/articles');
app.use('/articles', articles);

// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000.');
});
