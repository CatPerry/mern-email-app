import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  //we could put all the rendering logic inside the return statement below
  // but adding it up here is cleaner
  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      // Note we can use just the name or label key rather than field.name
      //because we used ES6 destructuring in the .map function arguments.
      //so indstead of importing formFields and field, we drilled down further.
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  return <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button className="yellow darken-3 white-text btn-flat" onClick={onCancel}>
        Back
      </button>
      {/* here is an action creator. note: passing in the history object allow the action */}
      {/* creator to know about the react router routes (otherwise it wouldnt know) */}
      {/* we have to get access to the history object THROUGH react-router-dom's withRouter*/}
      <button onClick={() => submitSurvey(formValues, history)} className="green btn-flat right with-text">
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>;
};

function mapStateToProps(state) {
  return { formValues: state.form.surveyForm.values };
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(SurveyFormReview));
