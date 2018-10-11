const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for your feedback!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    //email and url are using ES6 destructuring, so we're not papssing in the entire event object
    //but instead are passing in only the properties we care about. 
    const events = _.map(req.body, ({email, url}) => {
      //URL is a function that we have access to through NODEjs. 
      const pathname = new URL(url).pathname;
      //this uses the Path method: the :colon specifies what item we want ot extract
      const p = new Path('/api/surveys/:surveyId/:choice');
      const match = p.test(pathname);
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice };
      }
    });
    //the lodash lib can help us with compact to avoid sendign anythign tha tis not an object, is undefined or is null
    //such as a url that doesnt contain /api/surveys for example 
    const compactEvents = _.compact(events);
    //lodash lib has a uniqBy fuction that we can say then, go thru compactEvents and look at the
    //email AND the surveyId key/value pairs to see if there are any duplicates, and if so delete them
    //a single user can vote on teo different surveys but they cannot vote on the same survey multiple times.
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
    console.log(uniqueEvents);
    res.send({})
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