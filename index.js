const express = require('express');
//the above is a common JS module type, it's s system of requiring other files, rather than using import which is for es2015 apps—this is for ths Node side of the app. For React we can use import
//you can for th ebleow have multiples instances of APP/ 
const mongoose = require('mongoose');
const keys = require('./config/keys');

//since we're not using passort here in a typical way with new instances we dont even need the instance variable; just require etc. 
require('./services/passport');
require('./models/user');

mongoose.connect(keys.mongoURI);

const app = express();
require('./routes/authRoutes')(app);

//this listens for herokus dynamic port in a prodcution env.
const PORT = process.env.port || 5000;
app.listen(PORT);