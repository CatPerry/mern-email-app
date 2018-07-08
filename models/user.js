const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//the above is broken down into this ES 2015 desturcturing . We'll be doing this throughout the course

//this schema is nec for mongoose NOT MONGO. because mongo dosent need consistency in the propertes a database has

const {Schema} = mongoose;
const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number, 
    default: 0
  }
});

mongoose.model('users', userSchema);