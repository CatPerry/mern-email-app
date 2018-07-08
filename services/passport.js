const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

//what's passed into here is what we just got from google below and are passing into the database. The user below is a mongo model instance.
//this takes the User model and puts some identifying information INTO THE TOKEN
passport.serializeUser((user, done) => {
  done(null, user.id);
});
//here wer query over the database we use the model class. Here we pull that identifying info back out to be able to use sometime in the future.
passport.deserializeUser((id, done) => {
  User.findById(id)
  //the above returns a promise that will will be handled asynchrounously with a .then
  .then(user => {
    done(null, user);
  });
});

//this needs a CLIENT ID and  CLIENT SECRET
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
      //this arrow function is where wer save user infotmation oto our database
    }, 
    //ASYNC AWAIT, ES2015
    async (accessToken, refreshToken, profile, done) => {
      //this code uses promises, which help handle asynchronous code, hence the use of .then
      const existingUser = await User.findOne({googleId: profile.id})
      if (existingUser) {
        //we already have reocord with porlife id
        return done(null, existingUser);
      }
      //we dont have a profile with tha tID
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);  
    }
  )
);