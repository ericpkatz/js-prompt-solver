import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clear, attemptLogin, logout, fetchCourses, fetchEnrollments, fetchPromptAttempts, fetchFeedbacks, fetchAdmin, fetchFeedbacksTo, fetchAvailableFeedbackMap} from '../store';
import AdminDashboard from './Admin/Dashboard';
import AdminCourse from './Admin/Course';
import AdminEnrollments from './Admin/Enrollment';
import PromptAttempt from './PromptAttempt';
import Enrollment from './Enrollment';
import Home from './Home';
import Feedback from './Feedback';
import FeedbackTo from './FeedbackToYou';
import ProvideFeedback from './ProvideFeedback';
import LeaveFeedback from './LeaveFeedback';
import History from './History';
import Practice from './Practice';
import Profile from './Profile';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const App = ()=> {
  const { promptAttempts, codePrompts, auth, enrollments, assignments } = useSelector(state => state);
  const [ error, setError ] = useState('');
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
      Promise.all([
        dispatch(fetchEnrollments()),
        dispatch(fetchFeedbacksTo()),
        dispatch(fetchAvailableFeedbackMap())
      ])
      .catch(ex =>{
        setError(ex.response.data.error);
      });
      
    }
    if(prev && prev.id && !auth.id){
      dispatch(clear(navigate));
    }
  }, [auth]);

  return (
    <div>
      {
        !!error && <div className='alert alert-danger'>{ error }</div>
      }
      <main>
        <h1 id='title'><Link to='/'>JS Prompt Solver</Link></h1>
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
                <Link to='/history' className='me-3'>History</Link>
                <Link to='/profile' className='me-3'>Profile</Link>
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
          <Route path='/admin/enrollments/:id' element={ <AdminEnrollments /> } />
          <Route path='/enrollments/:id' element={ <Enrollment /> } />
          <Route path='/feedback' element={ <Feedback /> } />
          <Route path='/profile' element={ <Profile /> } />
          <Route path='/history' element={ <History /> } />
          <Route path='/history/practice/:id' element={ <Practice /> } />
          <Route path='/enrollments/:id/feedbacks/:promptAttemptId' element={ <FeedbackTo /> } />
          <Route path='/enrollments/:enrollmentId/feedbacks/:promptAttemptId/leave' element={ <LeaveFeedback /> } />
          <Route path='/promptAttempts/:id/provideFeedback' element={ <ProvideFeedback /> } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
