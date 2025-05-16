import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ReportFoodPage from './pages/ReportFoodPage.tsx';
import ViewRequestsPage from './pages/ViewRequestsPage.tsx';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-food" element={<ReportFoodPage />} />
        <Route path="/view-requests" element={<ViewRequestsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
