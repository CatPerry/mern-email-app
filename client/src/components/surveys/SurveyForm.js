//SurveyForm shows a form for a user to add input
//this below helper allows this form to communicate with redux store
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields'

class SurveyForm extends Component {
  //this is a helper function we're creating just to keep 
  //render function below clean and to separate concerns
  
  // this uses both the Swiss army knife functionality of Field plus our SurveyField, and says, hey Field put whatever we create in Survey Field as the component you display. Note the label parameter is something being passed into the SurveyField DYNAMICALLY. So that we can reuse the SurveyField.js helper funciton 
  renderFields() {
    //lodash gives us all kinds of functions, including .map
    return _.map(formFields, ({ label, name }) => {
      //note anytime you iterate a list in React, each item need sto have a Unique KEY. Hence the adition of key.
      return <Field key={name} component={SurveyField} type="text" label={label} name={name} />;
    });
  }
        /* DRYING UP THE BELOW, becomes the above */
        /* renderFields() {
              return (
                <div>
                  <Field label='Survey Title' type='text' name='title' component={SurveyField}/>
                  <Field label='Subject Line' type='text' name='subject' component={SurveyField} />
                  <Field label='Email Body' type='text' name='body' component={SurveyField} />
                  <Field label='Recipient List' type='text' name='emails' component={SurveyField} /> 
                </div>;
            }
        */

  render() {
    return <div>
        {/* //the below handleSubmit function is coming from reduxFomr library, we can pass it our own functions, I'm passing it a onSurveySubimt callback function, but at first we're NOT invoking*/}
      <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}

          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>;
  }
}

function validate(values) {
  //"values above is all the objects coming off of our form"
const errors = {};
  errors.recipients = validateEmails(values.recipients || "");

  _.each(formFields, ({ name, noValueError }) => {
  if (!values[name]) {
    errors[name] = noValueError;
  }
})
  return errors;
}

//unlike other export modules reduxForm takes in only one property
export default reduxForm({
  validate: validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);