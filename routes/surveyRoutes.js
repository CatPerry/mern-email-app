const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewaares.requireCredits');

const Survey = mongoose.model('surveys');

module.exports = app => {
  //note this post request will take in as many arguments as you want and will keep going until it executes the req res 
  app.post('/api/surveys', requireLogin, requireCredits, (req, res) => {
    //first we make sure the user is logged in to create a survey; plus we want ot make sure they have enough credit for creating the survey
    //the above is middleware or an executable funciton, it's adde din the order that we want it t be executed
    //everything is connected to req.body so the following is ES6 destructuring
    const { title, subject, body ,recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => { return {email: email}}), 
      _user: req.user.id, 
      dateSent: Date.now()

    });
  });
};