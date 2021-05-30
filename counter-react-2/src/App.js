import React from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from "./components/Counter";
import UploadSheets from './components/UploadSheets'

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Counter/>
        <UploadSheets/>
      </header>
    </div>
  );
}

export default App;
