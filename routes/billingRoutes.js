const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

//this all handles the back end. This will mirror some of whats on the front end
module.exports = app => {
  app.post('/api/stripe', async (req, res) => {
    if (!req.user) { 
      return res.status(401).send({error: "You must log in"});
    }

    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: 'Adding $5 for 5 credits',
      source: req.body.id
    });

    req.user.credits += 5;
    const user = await req.user.save();

    res.send(user);
  }); 
};