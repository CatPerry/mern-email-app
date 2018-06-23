const passport = require('passport');

//we need to make app accessible from/to here so we'll use module.exports and an arrow function.
module.exports = (app) => {
  //this is a route handler
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    //this send them along but includes the CODE form the user.thi is the diff between the above and below GETS
    '/auth/google/callback', passport.authenticate('google')
  );
}