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

export const fetchPrompts = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/prompts', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_PROMPTS', prompts: response.data });
  };
};

export const savePromptAttempt = (promptAttempt)=> {
  return async(dispatch)=> {
    console.log(promptAttempt);
    /*
    const response = await axios('/api/promptAttempts', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_PROMPT_ATTEMPTS', promptAttempts: response.data });
    */
  };
};

export const fetchPromptAttempts = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/promptAttempts', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_PROMPT_ATTEMPTS', promptAttempts: response.data });
  };
};

export const fetchCohorts = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/cohorts', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_COHORTS', cohorts: response.data });
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

const prompts = (state = [], action)=> {
  if(action.type === 'SET_PROMPTS'){
    return action.prompts;
  }
  return state;
};

const promptAttempts = (state = [], action)=> {
  if(action.type === 'SET_PROMPT_ATTEMPTS'){
    return action.promptAttempts;
  }
  return state;
};

const cohorts = (state = [], action)=> {
  if(action.type === 'SET_COHORTS'){
    return action.cohorts;
  }
  return state;
};

const admin = combineReducers({
  courses
});

const reducer = combineReducers({
  auth,
  admin,
  cohorts,
  codePrompts: prompts,
  promptAttempts
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
