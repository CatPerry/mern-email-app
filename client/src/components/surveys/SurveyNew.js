//This is the PARENT to SurveyFomr and SurveyFormReview, and is responsible for displaying these both.
import React, {Component} from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from "./SurveyFormReview";


class SurveyNew extends Component {
  state = { showFormReview: false }; 
  //this sets the compnent level state in the class React way, compared to above
  // constructor(props) {
  //   super(props);
  //   this.state = { new: true };
  // }

  renderContent() {
    if (this.state.showFormReview) {
      return < SurveyFormReview
        onCancel={() => this.setState({ showFormReview: false })}
      />;
    }
    return (
      < SurveyForm 
        onSurveySubmit={() => this.setState({showFormReview: true})} 
      />
    );
  }

  render() {
    return (
      <div className="textbox">
        {this.renderContent()}
      </div>
    );
  }
}

export default reduxForm({
  form: 'surveyForm'
})(SurveyNew);