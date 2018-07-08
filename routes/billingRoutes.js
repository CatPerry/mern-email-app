const keys = require('../config/keys');
const stripe = require('stripe')(keys.STRIPE_SECRET_KEY);

module.exports = app => {
  app.post('/api/stripe', (req, res) => {
    
  });
};