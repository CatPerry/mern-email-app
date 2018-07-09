const passport = require('passport');

//we need to make app accessible from/to here so we'll use module.exports and an arrow function.
module.exports = app => {
  //this is a route handler
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    //this send them along but includes the CODE form the user.thi is the diff between the above and below GETS
    '/auth/google/callback', 
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  //this takes the cookie and kills the session/token
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  //is the route where we make a request to see whther someone is logged in or not, right when the API is booted up. we do that with an ACTION CREATER, eg feth library
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  })
};