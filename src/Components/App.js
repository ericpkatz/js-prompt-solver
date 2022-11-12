import React, { useEffect, useRef } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clear, attemptLogin, logout, fetchCourses, fetchEnrollments, fetchPromptAttempts, fetchFeedbacks, fetchAdmin} from '../store';
import AdminDashboard from './Admin/Dashboard';
import AdminCourse from './Admin/Course';
import PromptAttempt from './PromptAttempt';
import Enrollment from './Enrollment';
import EnrollmentFeedback from './EnrollmentFeedback';
import Home from './Home';
import Feedback from './Feedback';
import ProvideFeedback from './ProvideFeedback';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const App = ()=> {
  const { promptAttempts, codePrompts, auth, enrollments, assignments } = useSelector(state => state);
  const isAdmin = auth.isAdmin;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _logout = ()=> {
    dispatch(logout());
  };

  const prev = usePrevious(auth);

  useEffect(()=> {
    dispatch(attemptLogin())
      .catch(ex => {
        navigate('/');
      });
  }, []);

  useEffect(()=> {
    if(auth.isAdmin){
      dispatch(fetchAdmin());
    }
    if(auth.id){
      dispatch(fetchEnrollments());
      //dispatch(fetchPromptAttempts());
      //dispatch(fetchFeedbacks());
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
            <Link to='/'>JS Prompt Solver</Link>
            <Link to='/feedback'>Feedback</Link>
          </nav>
        )
      }
      <main>
        <section id='welcome'>
          {
            !!auth.id && (
              <div className='mt-3'>
                <label className='pe-3'>
                Welcome { auth.login }!
                </label>
            {
              auth.isAdmin && <Link className='me-3' to='/admin'>Admin</Link>
            }
                <button className='btn btn-primary btn-sm' onClick={ _logout }>Logout</button>
              </div>
            )
          }
        </section>
        {
          !auth.id && <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT_ID}`}>Login with your Github Account</a>
        }
        {
          !!auth.id && !isAdmin && !enrollments.length && <div>You have no enrollments.</div>
        }
        <Routes>
          <Route path='/' element={ <Home /> } />
          <Route path='/admin' element={ <AdminDashboard /> } />
          <Route path='/admin/courses/:id' element={ <AdminCourse /> } />
          <Route path='/enrollments/:id' element={ <Enrollment /> } />
          <Route path='/feedback' element={ <Feedback /> } />
          <Route path='/enrollments/:id/feedback' element={ <EnrollmentFeedback /> } />
          <Route path='/promptAttempts/:id/provideFeedback' element={ <ProvideFeedback /> } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
