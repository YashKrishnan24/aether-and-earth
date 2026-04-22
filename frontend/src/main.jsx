import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 


import { Provider } from 'react-redux';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App in the Provider and pass in the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);