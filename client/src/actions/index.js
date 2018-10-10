import axios from 'axios';
import { FETCH_USER } from './types';

//Now we'll configure it one more time using async await AND two minialist/compact arrow functions
export const fetchUser = () => async dispatch => {  
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data});
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);  
  dispatch({ type: FETCH_USER, payload: res.data });
};


//instead this function call will return a function. And note: the purpos of eteh midleware is to inspect whatever is returned from a request like this. When thunk sees that we're retuning a FUNCTIOn it will instead automatically pass in the DISPATCH FUNCTION, from where our actions will be funneld to the different reducers AT ANY TIME.
// export const fetchUser = () => {
//   //so for these purposes, we want to call the dispatch function AFTER the get request below hs been succesffully completed.
//   return function(dispatch) {  
//     axios
//       .get('/api/current_user')
//       .then(res => dispatch({ type: FETCH_USER, payload: res}));
//   }
// };

//NOTE: the standard way to do this axios call, but this way the action has to be returned IMMEDIATELy. Instead we're using redux-thunk:
// const fetchUser = () => {
//   axios.get('/api/current_user');  

//   return {
//     type: FETCH_USER,
//     payload: request
//   }
// };

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);
   
  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};