import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments } from '../store';

const Feedback = ()=> {
  const { promptAttempts, codePrompts, auth, enrollments, assignments } = useSelector(state => state);
  const navigate = useNavigate();
  useEffect(()=> {
    if(enrollments.length === 1){
      navigate(`/enrollments/${enrollments[0].id}/feedback`);
    }
  }, [enrollments]);

  return (
      <div>
      {
        enrollments.map( enrollment => {
          return (
            <div key={ enrollment.id}>
              <h2><Link to={`/enrollments/${enrollment.id}/feedback`}>{ enrollment.cohort.name } { enrollment.cohort.course.title } Feedback</Link></h2>
            </div>
          );
        })
      }
      </div>
  );
};

export default Feedback;
