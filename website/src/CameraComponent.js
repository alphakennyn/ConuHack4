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
      showCamera: false
    }
    this.onTakePhoto = this.onTakePhoto.bind(this);
  }

  componentDidMount() {
    this.setState({
      showCamera: true,
    })
  }

  onTakePhoto(dataUri) {
    console.log(dataUri.length);
    this.setState({
      showCamera: false,
    })
    axios.post(`${url.endPoint}detectPic`,{ image_data: dataUri }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      this.setState({
        showCamera: true,
      })
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

  /**
   * Because mobile has touch support
   */
  static isMobile() {
    return 'ontouchstart' in document.documentElement;
  }

  render() {
    //console.log(windowDim.width);
    console.log(this.constructor.isMobile());
    const { width, height} = this.constructor.windowDimension();
    console.log(width, height);
    return (
      <div className="app-container"
        onDragCapture={() => {
          alert('hey')
        }}
      >
        { this.state.showCamera ? 
          <Camera
            onTakePhoto = {(dataUri) => { 
              this.onTakePhoto(dataUri); 
            }}
            idealFacingMode="environment"
            //idealResolution={{width, height}}
            isImageMirror={!this.constructor.isMobile()}
            sizeFactor={0.7}
          /> : <p>Wait a minute you fuck</p>
        }
      </div>
    )
  }
}

export default ClCamera;