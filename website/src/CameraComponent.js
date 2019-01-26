import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import './Camera.css';

class ClCamera extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.state = {
      capturedImage: null,
      captured: false,
      uploading: false
    }
    this.onTakePhoto = this.onTakePhoto.bind(this);
  }

  componentDidMount() {
  }

  onTakePhoto(dataUri) {
    console.log(dataUri);
  }

  static windowDimension() {

  }

  render() {
    //console.log(windowDim.width);
    return (
      <div className="app-container">
        <Camera
          onTakePhoto = {(dataUri) => { 
            this.onTakePhoto(dataUri); 
          }}
          idealFacingMode="environment"
        />
      </div>
    )
  }
}

export default ClCamera;