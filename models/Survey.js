const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],
  yes: {type: Numer, default: 0 },
  no: { type: Numer, default: 0 }
});

mongoose.model('surveys', surveySchema);