import React, { Component } from 'react';

//import Camera from 'react-html5-camera-photo';
import Camera from "react-webcam";

import axios from 'axios';
//import 'react-html5-camera-photo/build/css/index.css';
import './Camera.css';
import url from './configs/url.json';
import SweetAlert from 'sweetalert2-react';
import icon from './btnIcon.png';

class ClCamera extends Component {
  constructor() {
    super();
    this.setRef = webcam => {
      this.webcam = webcam;
    };
    this.state = {
      showCamera: false,
      result: {},
    }
    this.onTakePhoto = this.onTakePhoto.bind(this);
  }

  componentDidMount() {
    this.setState({
      showCamera: true,
    })
  }

  onTakePhoto() {
    const dataUri = this.webcam.getScreenshot();

    this.setState({
      showCamera: false,
    })

    const image_data = dataUri.replace("data:image/jpeg;base64,", "");
    const data = {
      image_data,
    }

    const result = {};
    axios.post(`${url.endPoint}send_nudes`,data).then((res) => {
      
      result.passed = true;
      result.message = '';

    }).catch((err) => {
      result.passed = false;
      result.message = err.message;
    }).finally(() => {
      this.setState({
        showCamera: true,
        result,
      })
    })
  }

  clearResult() {
    this.setState({
      result: {}
    })
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
    const { width, height} = this.constructor.windowDimension();

    return (
      <div className="app-container"
        onDoubleClick={() => 
          this.onTakePhoto()
        }
      >
        <SweetAlert
          show={this.state.result.passed}
          title="Result"
          text={this.state.result.message}
          type="success"
          onConfirm={() => this.setState({ result: '' })}

        />
        <SweetAlert
          show={this.state.result.message && !this.state.result.passed}
          title="Error"
          text={this.state.result.message}
          type="error"
          onConfirm={() => this.setState({ result: '' })}

        />
        { this.state.showCamera ? 
          <Camera
            audio={false}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: width,
              height: height,
              facingMode: "environment"
            }}
          />
          : <p>Wait a minute you fuck</p>
        }
        <img src={icon} id="img-button" onClick={() => this.onTakePhoto()}/>
      </div>
    )
  }
}

export default ClCamera;