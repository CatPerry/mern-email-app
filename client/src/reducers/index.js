import { combineReducers } from 'redux';
//below {reducer} is a built in redux-form, but since that's confusing...
//was can use handy ES2015 tools to say the below rahter than import { reducer } from 'redux-form'
import { reducer as reduxForm } from 'redux-form'
import authReducer from './authReducer';

export default combineReducers({
  auth: authReducer,
  //this key is very important and it's built in with reduxForm. Key is what they wan t you to use. CHeck documentation.
  form: reduxForm
});