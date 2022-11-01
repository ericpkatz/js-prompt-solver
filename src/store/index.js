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

export const fetchAdmin = ()=> {
  return (dispatch)=> {
    dispatch(fetchUsers());
    dispatch(fetchCourses());
    dispatch(fetchAdminPromptAttempts());
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

export const fetchAdminPromptAttempts = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/promptAttempts', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_ADMIN_PROMPT_ATTEMPTS', promptAttempts: response.data });
  };
};

export const fetchUsers = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/users', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_USERS', users: response.data });
  };
};

export const savePromptAttempt = (promptAttempt)=> {
  return async(dispatch)=> {
    const response = await axios('/api/promptAttempts', {
      method: 'post',
      withCredentials: true,
      data: promptAttempt
    });
    dispatch(fetchPromptAttempts());
  };
};

export const createFeedback = (feedback)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/feedbacks/${feedback.id}`, {
      method: 'put',
      withCredentials: true,
      data: feedback 
    });
    dispatch(fetchFeedbacks());
  };
};

export const clear = (navigate)=> {
  return (dispatch)=> {
    dispatch({ type: 'SET_ASSIGNMENTS', assignments: [] });
    dispatch({ type: 'SET_COHORTS', cohorts: [] });
    dispatch({ type: 'SET_COHORTS', cohorts: [] });
    navigate('/');
  };
};

export const fetchAssignments = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/assignments', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_ASSIGNMENTS', assignments: response.data });
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

export const fetchFeedbacks = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/feedbacks', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_FEEDBACKS', feedbacks: response.data });
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

const users = (state = [], action)=> {
  if(action.type === 'SET_USERS'){
    return action.users;
  }
  return state;
};

const adminPromptAttempts = (state = [], action)=> {
  if(action.type === 'SET_ADMIN_PROMPT_ATTEMPTS'){
    return action.promptAttempts;
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

const feedbacks = (state = [], action)=> {
  if(action.type === 'SET_FEEDBACKS'){
    return action.feedbacks;
  }
  return state;
};

const assignments = (state = [], action)=> {
  if(action.type === 'SET_ASSIGNMENTS'){
    return action.assignments;
  }
  return state;
};

const admin = combineReducers({
  courses,
  users,
  promptAttempts: adminPromptAttempts
});

const reducer = combineReducers({
  auth,
  admin,
  cohorts,
  promptAttempts,
  assignments,
  feedbacks
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
