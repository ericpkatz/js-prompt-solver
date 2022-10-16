import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout } from '../store';

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
      <h1>Welcome to Prompt Solver</h1>
      {
        !auth.id && <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT_ID}`}>Login to Github</a>
      }
      {
        !!auth.id && (
          <div>
            Welcome { auth.login }
            <button onClick={ _logout }>Logout</button>
          </div>
        )
      }
    </div>
  );
};

export default App;
