import React from 'react';
import './index.css';
import App from './App';
import {
  BrowserRouter,
} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import AppProvider from './hooks/app_provider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);