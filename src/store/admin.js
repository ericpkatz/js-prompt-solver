import { combineReducers } from 'redux';
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
    dispatch(fetchTopics());
    dispatch(fetchCourses());
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

export const fetchUsers = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/users', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_USERS', users: response.data });
  };
};

export const fetchTopics = ()=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/topics', {
      method: 'get',
      withCredentials: true
    });
    dispatch({ type: 'SET_TOPICS', topics: response.data });
  };
};


export const addEnrollment = (enrollment)=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/enrollments', {
      method: 'post',
      withCredentials: true,
      data: enrollment 
    });
    dispatch(fetchCourses());
  };
};

export const createUser = (user)=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/users', {
      method: 'post',
      withCredentials: true,
      data: user 
    });
    dispatch(fetchUsers());
  };
};

export const createCohort = (cohort)=> {
  return async(dispatch)=> {
    const response = await axios('/api/admin/cohorts', {
      method: 'post',
      withCredentials: true,
      data: cohort 
    });
    dispatch(fetchCourses());
  };
};

export const assignTopic = ({ topicId, cohortId })=> {
  return async(dispatch)=> {
    const response = await axios(`/api/admin/cohorts/${cohortId}`, {
      method: 'put',
      withCredentials: true,
      data: { topicId } 
    });
    dispatch(fetchCourses());
  };
};

export const deleteCohort = (cohort)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/admin/cohorts/${cohort.id}`, {
      method: 'delete',
      withCredentials: true,
    });
    dispatch(fetchCourses());
  };
};

export const deleteUser = (user)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/admin/users/${user.id}`, {
      method: 'delete',
      withCredentials: true,
    });
    dispatch(fetchUsers());
    dispatch(fetchCourses());
  };
};

export const deleteEnrollment = (enrollmentId)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/admin/enrollments/${enrollmentId}`, {
      method: 'delete',
      withCredentials: true,
    });
    dispatch(fetchCourses());
  };
};

export const fetchEnrollment = (enrollmentId)=> {
  return async(dispatch)=> {
    const response = await axios(`/api/admin/enrollments/${enrollmentId}`, {
      method: 'get',
      withCredentials: true,
    });
    dispatch({ type: 'SET_ENROLLMENT', enrollment: response.data });
  };
};

const courses = (state = [], action)=> {
  if(action.type === 'SET_COURSES'){
    return action.courses;
  }
  return state;
};

const enrollments = (state = {}, action)=> {
  if(action.type === 'SET_ENROLLMENT'){
    return {...state, [action.enrollment.id]: action.enrollment };
  }
  return state;
};

const users = (state = [], action)=> {
  if(action.type === 'SET_USERS'){
    return action.users;
  }
  return state;
};

const topics = (state = [], action)=> {
  if(action.type === 'SET_TOPICS'){
    return action.topics;
  }
  return state;
};

const admin = combineReducers({
  courses,
  users,
  topics: topics,
  enrollments
});


export default admin;
