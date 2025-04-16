import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { UserProvider } from './components/UserContext';
import ReactDOM from 'react-dom/client';
import './styles.css';
import ManagerApprovalPage from './components/ManagerApprovalPage';
import Login from './components/LoginPage'


const router = createBrowserRouter([
  {path:'/login', element:<Login />},
  {path:'/approveTransactions', element:<ManagerApprovalPage />},

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>
);

