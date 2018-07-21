// creating a subdocument collection for the recipents 
// records email addy and whether theyv'e clicked the survey response or not
const mongoose = require('mongoose');
const { Schema} = mongoose;

const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false}
});

module.exports = recipientSchema;