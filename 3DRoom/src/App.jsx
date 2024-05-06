import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';

import './reset.css';
import './style.css';

import './App.css';
import Room from './pages/Room';

function App() {
  

  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        
        <Route path="/model" element={<Room />} />
        
        
      </Routes>
      {/* <Footer /> */}
    </Router>
  )
}

export default App
