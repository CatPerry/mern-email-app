const express = require('express');
//the above is a common JS module type, it's s system of requiring other files, rather than using import which is for es2015 apps—this is for ths Node side of the app. For React we can use import
//you can for th ebleow have multiples instances of APP/ 
const app = express();

//this is a route handler
app.get('/', (req, res) => {
  res.send({hi: "there"});
});
//this listens for herokus dynamic port in a prodcution env.
const PORT = process.ENV.port || 5000
app.listen(PORT);