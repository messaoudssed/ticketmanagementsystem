import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageTickets from './pages/admin/ManageTickets'
import ManageUsers from './pages/admin/ManageUsers'
import Settings from './pages/admin/Settings'
import AdminAnalytics from './pages/admin/AdminAnalytics'

import TechDashboard from './pages/tech/TechDashboard'

import UserDashboard from './pages/user/UserDashboard'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="admin" element={<AdminDashboard />}>
            <Route path="tickets" element={<ManageTickets />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          <Route path="tech" element={<TechDashboard />} />
          <Route path="user" element={<UserDashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
