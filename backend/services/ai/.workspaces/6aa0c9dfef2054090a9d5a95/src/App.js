import React from 'react';
import './App.css';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <Header />
      <ProjectList />
      <Contact />
    </div>
  );
}

export default App;
