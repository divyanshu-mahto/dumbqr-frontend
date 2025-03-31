import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Editqr from './components/Editqr.jsx'
import Createqr from './components/Createqr.jsx'
import Analytics from './components/Analytics.jsx'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
import Verifycode from './components/Verifycode.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import ForgotPasswordUpdate from './components/ForgotPasswordUpdate.jsx'
import NotFoundErrorPage from './components/NotFoundErrorPage.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <App />
      </Layout>
    ),
    // errorElement: <NotFoundErrorPage />
    errorElement: (
      <Layout>
        <NotFoundErrorPage />
      </Layout>
    )
  },
  {
    path: '/signup',
    element: (
      <Layout>
        <Signup/>
      </Layout>
    ),
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: '/verify',
    element: (
      <Layout>
        <Verifycode />
      </Layout>
    ),
  },
  {
    path: '/forgot',
    element: (
      <Layout>
        <ForgotPassword />
      </Layout>
    ),
  },
  {
    path: '/forgot/passwordupdate',
    element: (
      <Layout>
        <ForgotPasswordUpdate />
      </Layout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: '/editqr/:id', 
    element: (
      <Layout>
        <Editqr />
      </Layout>
    ),
  },
  {
    path: '/createnew',
    element: (
      <Layout>
        <Createqr />
      </Layout>
    ),
  },
  {
    path: '/analytics/:id', 
    element: (
      <Layout>
        <Analytics />
      </Layout>
    ),
  },
],
{
  basename: "/"
},
{
  scrollBehavior: "auto"
}
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
    </RouterProvider>
  </StrictMode>,
)
