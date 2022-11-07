import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments } from '../store';

const Home = ()=> {
  const { promptAttempts, codePrompts, auth, enrollments, assignments } = useSelector(state => state);

  return (
      <div>
      {
        enrollments.map( enrollment => {
          return (
            <div key={ enrollment.id}>
              <h2><Link to={`/cohorts/${enrollment.id}`}>{ enrollment.cohort.name } { enrollment.cohort.course.title }</Link></h2>
              <div>
                { enrollment.cohort.course.description }
              </div>
            </div>
          );
        })
      }
      </div>
  );
};

export default Home;
