import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments } from '../store';

const Home = ()=> {
  const { promptAttempts, codePrompts, auth, cohorts, assignments } = useSelector(state => state);

  return (
      <div>
      {
        cohorts.map( cohort => {
          const filteredAssignments = assignments
            .filter(assignment => assignment.cohortId === cohort.id)
            .filter(({ due, assigned }) => {
              const now = new Date();
              return now > new Date(assigned) && now < new Date(due); 
            });
          let shown = false;
          return (
            <div key={ cohort.id}>
              <h2><Link to={`/cohorts/${cohort.id}`}>{ cohort.name } { cohort.course.title }</Link></h2>
              <div>
                { cohort.course.description }
              </div>
            </div>
          );
        })
      }
      </div>
  );
};

export default Home;
