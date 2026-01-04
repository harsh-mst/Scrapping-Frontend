import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrapeUser from './components/ScrapeUser';
import Feed from './components/Feed';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>LinkedIn Post Scraper</h1>
        </header>
        <Routes>
          <Route path="/" element={<ScrapeUser />} />
          <Route path="/feed/:username" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
