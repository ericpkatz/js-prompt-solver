import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout } from '../store';
import AdminDashboard from './Admin/Dashboard';

const App = ()=> {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const _logout = ()=> {
    dispatch(logout());
  };
  useEffect(()=> {
    dispatch(attemptLogin());
  }, []);
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
      <Routes>
        <Route path='/admin' element={ <AdminDashboard /> } />
      </Routes>
    </div>
  );
};

export default App;
