if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  //this both requires and supplies the dev keys for the development ienvironment
  module.exports = require('./dev');
}