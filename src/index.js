import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import { HashRouter } from 'react-router-dom';
import App from './Components/App';

createRoot(document.querySelector('#root')).render(
  <Provider store={ store }>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
