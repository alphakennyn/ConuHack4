import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Camera from './CameraComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Camera/>
      </div>
    );
  }
}

export default App;
