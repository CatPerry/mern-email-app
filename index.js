const express = require('express');
//the above is a common JS module type, it's s system of requiring other files, rather than using import which is for es2015 apps—this is for ths Node side of the app. For React we can use import
//you can for th ebleow have multiples instances of APP/ 
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
const app = express();

//this needs a CLIETN ID and  CLIENT SECRET
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      }, accessToken => {
        console.log(accessToken);
        }
      )
);

//this is a route handler
app.get(
  '/auth/google', 
  passport.authenticate('google', {
  scope: ['profile', 'email']
  })
);
//this listens for herokus dynamic port in a prodcution env.
const PORT = process.env.port || 5000
app.listen(PORT);