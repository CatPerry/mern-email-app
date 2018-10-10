const sendgrid = require('sendgrid'); 
const helper = sendgrid.mail;
const keys = require('../config/keys');

//Think about React when creatign this. We are creating a customized componenet, that extends the component-based class from the React library
class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    //whenever we create an instance of a Mailer, it will have these properties. note the helper functions are from the sendgrid library to correctly formt the fields
    this.from_email = new helper.Email("no-reply@emaily.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    //this built in helper function, addContent, comes from the above sendgrid Mail class. and it expects you to call addContent witht eh actual body that you want to use in the mail
    this.addContent(this.body);
    //enable click tracking, which is specially avalable through sendgrid, is a function that we define. It's not a predefined helper function through sendgrid
    this.addClickTracking();
    this.addRecipients();
  }
  //this formatAddresses helper function needs to parse trhough the recipients object being passed to it. So that's what this function is for
  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }
  addClickTracking() {
    //create helper variables. This is how sendgrid works. Read the documentation.
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }
  //this function we're creating serves to take the array of helper.Email objects we create in the formatAddresses helper function and actually add them to the body
  addRecipients() {
    const personalize = new helper.Personalization();
    //iterate over each recipient, and for each recipient addTo to epersonalize object. Then call this.addPersonalization, which is a funciton defined by the mail base class
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    //add entire personalized object
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;