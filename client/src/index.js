import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import SignUpView from './components/sign_up';


const router = createBrowserRouter([
  {
    path: "/",
    element: App(),
  },
  {
    path: "sign-up",
    element: SignUpView()
  },
  // {
  //   path: "sign-in",
  //   element: SignIn()
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

