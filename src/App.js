import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Register from './components/Register';
import AdminRegister from './components/AdminRegister';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Calendar from './components/Calendar';
import AdminCalendar from './components/AdminCalendar';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/admin-calendar" element={<AdminCalendar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
