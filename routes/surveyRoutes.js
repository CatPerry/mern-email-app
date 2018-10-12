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
  app.get('/api/surveys', requireLogin, async (req, res) => {
   const surveys = await Survey.find({ _user: req.user.id })
    .select({ recipients: false });

   res.send(surveys);
  }); 

  //the URL path colons are allowed in Express as wildcard/dynamic/paths, just like the Path class below
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send("Thanks for your feedback!");
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    //email and url are using ES6 destructuring, so we're not papssing in the entire event object
    //but instead are passing in only the properties we care about.
    //noe we're using lodash's .chain helper makes repetititve itteration cleanre 
    _.chain(req.body)
      .map(({email, url}) => {
        //URL is a function that we have access to through NODEjs. 
        //this uses the Path method: the :colon specifies what item we want ot extract
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      //the lodash lib can help us with compact to avoid sendign anythign tha tis not an object, is undefined or is null
      //such as a url that doesnt contain /api/surveys for example 
      .compact()
      //lodash lib has a uniqBy fuction that we can say then, go thru compactEvents and look at the
      //email AND the surveyId key/value pairs to see if there are any duplicates, and if so delete them
      //a single user can vote on teo different surveys but they cannot vote on the same survey multiple times.
      .uniqBy('email', 'surveyId')
        //using es6 destructing to pull surveyId, email and choice rather than the entire event object
      .each(({ surveyId, email, choice }) => {
        //this updateOne method is supplied by the Mongoose class
        //it's a two in one: it is a combo of Mongoose findOne method and update. It'll go find the record
        //the meets that criteria and then update it to the second object setup.
        Survey.updateOne({
          //Mongo DB uses _id NOT id
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false }
            }
          },
          {
            //this $inc is a Mongo operator. I tsays find the choice property and increments it by 1.
            // and this is using ES6 Key interpolation. and it allows it to increment the right choice
            $inc: { [choice]: 1 },
            //THE $set mongo operator says look at tha recipients subdocument collection and find the recipient key that 
            //matches with this recipient we really care about, we use the dollar sign. 
            //It works with the $elemMatch method, and sets the property responded to true
            $set: { 'recipients.$.responded': true },
            //Mongo needs .exec() funciton. Even though this is an async call, we dont need ot use an async /await
            // because Sendrid doesnt need a response back. Otherwise we'd need to.
            lastResponded: new Date()
          }).exec()
      })
      //value will always be the last return statement in the .chain
      .value();

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