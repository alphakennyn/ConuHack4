import React, { Component } from 'react';
import './App.css';
import Camera from './CameraComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Camera/>
        <h1>Help make the your city and the world more sustainable and green #hashish</h1>
      </div>
    );
  }
}

export default App;
