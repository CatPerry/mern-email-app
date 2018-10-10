const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/thanks', (req,res) => {
    res.send('Thanks for your feedback!');
  });
  //note this post request will take in as many arguments as you want, adding in the order you want them to execute, and will keep going until it executes the final req res 
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
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

    //Great place to send an email. SO we'll create an instance of the class. THen we'll pass in some object that contains a title, sub, body, and recipients. And we'll pass in the content/body of the email (as reppresented by surveyTemplate); surveyTemplate is a function that we expect to be called on the survey model
    const mailer = new Mailer(survey, surveyTemplate(survey));
    
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};