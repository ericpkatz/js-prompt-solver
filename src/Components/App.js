import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments } from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';

const App = ()=> {
  const { promptAttempts, codePrompts, auth, cohorts, assignments } = useSelector(state => state);
  console.log(assignments);
  const isAdmin = auth.isAdmin;
  const dispatch = useDispatch();
  const _logout = ()=> {
    dispatch(logout());
  };

  useEffect(()=> {
    dispatch(attemptLogin());
  }, []);

  useEffect(()=> {
    if(auth.isAdmin){
      dispatch(fetchCourses());
    }
    if(auth.id){
      dispatch(fetchCohorts());
      dispatch(fetchPromptAttempts());
      dispatch(fetchAssignments());
    }
  }, [auth]);

  return (

    <div>
      <h1><Link to='/'>Welcome to Prompt Solver</Link></h1>
      {
        !auth.id && <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT_ID}`}>Login to Github</a>
      }
      {
        !!auth.id && (
          <div>
            Welcome { auth.login }!
            <button onClick={ _logout }>Logout</button>
            {
              auth.isAdmin && <Link to='/admin'>Admin</Link>
            }
          </div>
        )
      }
      {
        !!auth.id && !isAdmin && !cohorts.length && <div>You have no enrollments.</div>
      }
      <ul>
      {
        cohorts.map( cohort => {
          const filteredAssignments = assignments
            .filter(assignment => assignment.cohortId === cohort.id)
            .filter(({ due, assigned }) => {
              const now = new Date();
              return now > new Date(assigned) && now < new Date(due); 
            });
          return (
            <li key={ cohort.id}>
            { cohort.id } { cohort.name } { cohort.course.title }
              <ul>
                {
                  filteredAssignments.map( assignment => {
                    return (
                      <li key={ assignment.id }>
                        { assignment.topic.title }
                        ({ new Date(assignment.assigned).toLocaleDateString() })-({ new Date(assignment.due).toLocaleDateString() })
                        <ul>
                          {
                            assignment.topic.codePrompts.sort((a, b)=> a.rank*1 - b.rank*1).map( codePrompt => {
                              const promptAttempt = promptAttempts.find( promptAttempt => promptAttempt.codePromptId === codePrompt.id) || { assignmentId: assignment.id, enrollmentId: cohort.enrollment.id, codePromptId: codePrompt.id };
                              return (
                                <li key={ codePrompt.id }>
                                  { codePrompt.title } ({ codePrompt.rank })
                                  <br />
                                  {
                                    !!promptAttempt.id ? 'ATTEMPTED' : 'NOT ATTEMPTED'
                                  }
                                  <br />
                                  { !!promptAttempt.submitted ? 'SUBMITTED' : 'NOT SUBMITTED'}
                                  <PromptAttempt promptAttempt={ promptAttempt }/>
                                </li>
                              );
                            })
                          }
                        </ul>
                      </li>
                    );
                  })
                }
              </ul>
            </li>
          );
        })
      }
      </ul>
      <Routes>
        <Route path='/admin' element={ <AdminDashboard /> } />
      </Routes>
    </div>
  );
};

export default App;
