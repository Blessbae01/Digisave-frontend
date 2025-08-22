import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // <-- Import HomePage
import CreateGroupPage from './pages/CreateGroupPage'; // <-- Import CreateGroupPage
import GroupPage from './pages/GroupPage'; // <-- Import GroupPage

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} /> {/* <-- Add HomePage Route */}
          <Route path="/create-group" element={<CreateGroupPage />} /> {/* <-- Add CreateGroupPage Route */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/groups/:id" element={<GroupPage />} /> {/* <-- Add this new route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;