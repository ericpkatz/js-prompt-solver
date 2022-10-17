import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

export const attemptLogin = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/auth', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

export const fetchCourses = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/courses', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_COURSES', courses: response.data });
  };
};

export const logout = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/auth', {
      method: 'delete',
      withCredentials: true
    });
    dispatch({ type: 'SET_AUTH', auth: {} });
  };
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

const courses = (state = [], action)=> {
  if(action.type === 'SET_COURSES'){
    return action.courses;
  }
  return state;
};

const admin = combineReducers({
  courses
});

const reducer = combineReducers({
  auth,
  admin
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
