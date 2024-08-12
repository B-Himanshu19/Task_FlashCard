import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Admin from './admin';
import Quiz from './Quiz';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold">
            Flashcard Quiz App
          </div>
          <ul className="flex space-x-6">
            {location.pathname === '/' && (
              <li>
                <Link
                  to="/admin"
                  className="hover:text-yellow-300 transition"
                >
                  Admin Panel
                </Link>
              </li>
            )}
            {location.pathname === '/admin' && (
              <li>
                <Link
                  to="/"
                  className="hover:text-yellow-300 transition"
                >
                  Quiz
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Quiz />} />
        </Routes>
      </div>

      <footer className="bg-blue-600 text-white py-4 text-center">
        © 2024 Flashcard Quiz App. All rights reserved.
      </footer>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
