import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPrompts, fetchPromptAttempts } from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';

const App = ()=> {
  const { promptAttempts, codePrompts, auth, cohorts } = useSelector(state => state);
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
      dispatch(fetchPrompts());
      dispatch(fetchPromptAttempts());
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
          return (
            <li key={ cohort.id}>
              { cohort.name } { cohort.course.title }
            </li>
          );
        })
      }
      </ul>
      <ul>
        {
          codePrompts.map(codePrompt => {
            const promptAttempt = promptAttempts.find( promptAttempt => promptAttempt.codePromptId === codePrompt.id) || {};
            return (
              <li key={ codePrompt.id }>
                { codePrompt.title }
                <div>
                  {
                    promptAttempt.attempt
                  }
                  <PromptAttempt promptAttempt={ promptAttempt }/>
                </div>
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
