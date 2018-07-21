const express = require('express');
//the above is a common JS module type, it's s system of requiring other files, rather than using import which is for es2015 apps—this is for ths Node side of the app. For React we can use import
//you can for th ebleow have multiples instances of APP/ 
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

//since we're not using passort here in a typical way with new instances we dont even need the instance variable; just require etc. 
require('./models/user');
require('./models/Survey');
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

const app = express();


//all these app.use call are using middleware, hwich are small functions that acan be used to modify incoming reqs to our app before they're sent off to route handlers. They can be wired up to handl eall actions or only ceratin action. You choose.
app.use(bodyParser.json());
app.use(
  //we're calling cookieSession and within it we'll provide a configuration object.   
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

//double parens here export a funciton
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

//the below configuration will make sure that EXPRESS behaves correctly when in the PRODuction environment. It will only be run in production
if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets, like main.js file
  app.use(express.static('client/build'));
  //Express will serve up the index.html file if id doesn't recognize the route. And this is the catch-all get request that serves up the index.html if no other middleware or route reqs via React routes or Express are able t served given what the browser/client is looking for.
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//this listens for herokus dynamic port in a prodcution env.
const PORT = process.env.PORT || 5000;
app.listen(PORT);