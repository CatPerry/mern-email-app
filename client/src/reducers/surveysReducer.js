import { FETCH_SURVEYS } from '../actions/types';

// this setup ensures that the authReducer only returns null, payload (user info) or false
export default function (state = [], action) {
  switch (action.type) {
    case FETCH_SURVEYS:
      return action.payload;
    default:
      return state;
  }
}