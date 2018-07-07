import {FETCH_USER} from '../actions/types';

// this setup ensures that the authReducer only returns null, payload (user info) or false
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;

    default:
    return state;
  }
}