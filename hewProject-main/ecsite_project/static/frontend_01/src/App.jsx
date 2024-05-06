import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ModelPage from './pages/ModelPage';
import './reset.css';
import './style.css';

import './App.css';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/model-page" element={<ModelPage />} />
      </Routes>
    </Router>
  )
}

export default App
