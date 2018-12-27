const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('req-flash');

router.use(expressValidator());

// Include User Model
const User = require('../models/users');

// Register Route
router.get('/register', function(req, res){
  res.render('register',{
    title:'Register'
  })
});

// Register POST
router.post('/register', function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  }else {
    const newUser = new User({
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if (err){
            console.log(err);
            return;
          }else {
            console.log('User registered');
            res.redirect('/');
          }
        });
      });
    });
  }
});

// Login Route
router.get('/login', function(req, res){
  res.render('login',{
    title:'Login'
  })
});

// Login POST
router.post('/login', function(req, res, next){
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'./register',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
