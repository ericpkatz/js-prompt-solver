import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const auth = (state = {}, action)=> {
  return state;
};

const reducer = combineReducers({
  auth
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
