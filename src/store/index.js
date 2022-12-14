import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';
import admin from './admin';

export const attemptLogin = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/auth', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

export const savePromptAttempt = (promptAttempt, special = false)=> {
  return async(dispatch)=> {
    const response = await axios('/api/promptAttempts', {
      method: 'post',
      withCredentials: true,
      data: promptAttempt
    });
    if(special){
      return response.data;
    }
    return dispatch(fetchEnrollments());
  };
};

export const removeStudentTest = (promptAttemptTest)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/promptAttemptTests/${promptAttemptTest.id}`, {
      method: 'delete',
      withCredentials: true,
    });
    return dispatch(fetchEnrollments());
  };
};

export const createPromptAttemptTest = (promptAttemptTest)=> {
  return async(dispatch)=> {
    const response = await axios('/api/promptAttemptTests', {
      method: 'post',
      withCredentials: true,
      data: promptAttemptTest
    });
    return dispatch(fetchEnrollments());
  };
};

export const updatePromptAttemptTest = (promptAttemptTest)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/promptAttemptTests/${promptAttemptTest.id}`, {
      method: 'put',
      withCredentials: true,
      data: promptAttemptTest
    });
    return dispatch(fetchEnrollments());
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
    dispatch({ type: 'SET_ENROLLMENTS', enrollments: [] });
    navigate('/');
  };
};

export const fetchEnrollments = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/enrollments', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_ENROLLMENTS', enrollments: response.data });
  };
};

export const fetchFeedbacksTo = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/feedbacks/to', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_FEEDBACKS_TO', feedbacks: response.data });
  };
};

export const fetchAvailableFeedbackMap = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/feedbacks/availableFeedbackMap', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_AVAILABLE_FEEDBACK_MAP', availableFeedbackMap: response.data });
  };
};

export const markAsReviewed = (feedback)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/feedbacks/to/${ feedback.id }/markAsReviewed`, {
      method: 'put',
      withCredentials: true
    });
    dispatch(fetchFeedbacksTo());
  };
};

export const resetTopic = ({ enrollmentId, topicId})=> {
  return async(dispatch)=> {
    const url = `/api/enrollments/${enrollmentId}/topics/${topicId}`;
    const response = await axios(url, {
      method: 'put',
      withCredentials: true
    });
    dispatch(fetchEnrollments());
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

const enrollments = (state = [], action)=> {
  if(action.type === 'SET_ENROLLMENTS'){
    return action.enrollments;
  }
  return state;
};

const feedbacksTo = (state = [], action)=> {
  if(action.type === 'SET_FEEDBACKS_TO'){
    return action.feedbacks;
  }
  return state;
};

const feedbacksFrom = (state = [], action)=> {
  if(action.type === 'SET_FEEDBACKS_TO'){
    return action.feedbacks;
  }
  return state;
};

const availableFeedbackMap = (state = [], action)=> {
  if(action.type === 'SET_AVAILABLE_FEEDBACK_MAP'){
    return action.availableFeedbackMap;
  }
  return state;
};

const reducer = combineReducers({
  auth,
  admin,
  enrollments,
  feedbacksTo,
  availableFeedbackMap
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
export * from './admin';
