import React, { useEffect, useRef } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clear, attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments, fetchFeedbacks} from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';
import Cohort from './Cohort';
import Home from './Home';
import Feedback from './Feedback';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const App = ()=> {
  const { promptAttempts, codePrompts, auth, cohorts, assignments } = useSelector(state => state);
  const isAdmin = auth.isAdmin;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _logout = ()=> {
    dispatch(logout());
  };

  const prev = usePrevious(auth);

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
      dispatch(fetchFeedbacks());
    }
    if(prev && prev.id && !auth.id){
      dispatch(clear(navigate));
    }
  }, [auth]);

  return (
    <div>
      {
        !!auth.id && (
          <nav>
            <Link to='/'>Home</Link>
            {
              auth.isAdmin && <Link to='/admin'>Admin</Link>
            }
          </nav>
        )
      }
      <main>
        <section id='welcome'>
          <h1>Welcome to JS Prompt Solver</h1>
          {
            !!auth.id && (
              <div>
                Welcome { auth.login }!
                <button onClick={ _logout }>Logout</button>
              </div>
            )
          }
        </section>
        {
          !auth.id && <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT_ID}`}>Login with your Github Account</a>
        }
        {
          !!auth.id && !isAdmin && !cohorts.length && <div>You have no enrollments.</div>
        }
        <Routes>
          <Route path='/' element={ <Home /> } />
          <Route path='/admin' element={ <AdminDashboard /> } />
          <Route path='/cohorts/:id' element={ <Cohort /> } />
          <Route path='/cohorts/:id/feedback' element={ <Feedback /> } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
