import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

const App = ()=> {
  const { auth } = useSelector(state => state);
  return (
    <div>
      <h1>Welcome to Prompt Solver</h1>
      {
        !auth.id && <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT_ID}`}>Login to Github</a>
      }
    </div>
  );
};

export default App;
