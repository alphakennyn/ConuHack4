import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import axios from 'axios';
import 'react-html5-camera-photo/build/css/index.css';
import './Camera.css';
import url from './configs/url.json';

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
    console.log(dataUri.length);
    axios.post(`${url.endPoint}detectPic`,dataUri).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err)
    })
  }

  sendImage(data) {
    return this.axios.post(`${url}detectPic`,data);
  }

  static windowDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  render() {
    //console.log(windowDim.width);
    const { width, height} = this.constructor.windowDimension();
    return (
      <div className="app-container">
        <Camera
          onTakePhoto = {(dataUri) => { 
            this.onTakePhoto(dataUri); 
          }}
          idealFacingMode="environment"
          idealResolution={{width, height}}
          isImageMirror={false}
          sizeFactor={0.5}
          //imageCompression={0.8}
        />
      </div>
    )
  }
}

export default ClCamera;