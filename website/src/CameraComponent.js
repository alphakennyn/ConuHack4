import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import axios from 'axios';
import 'react-html5-camera-photo/build/css/index.css';
import './Camera.css';
import url from './configs/url.json';
import SweetAlert from 'sweetalert2-react';


class ClCamera extends Component {
  constructor() {
    super();
    this.webcam = null;
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

  onTakePhoto(dataUri) {
    
    console.log(btoa(dataUri))
    this.setState({
      showCamera: false,
    })
    const result = {};
    axios.post(`${url.endPoint}detectPic`,{ image_data: dataUri }).then((res) => {
      
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
    //const { width, height} = this.constructor.windowDimension();

    return (
      <div className="app-container"
        onClick={() => {
          alert('hey')
        }}
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
            onTakePhoto = {(dataUri) => { 
              this.onTakePhoto(dataUri); 
            }}
            idealFacingMode="environment"
            //idealResolution={{width, height}}
            isImageMirror={!this.constructor.isMobile()}
            sizeFactor={this.constructor.isMobile() ? 1 : 0.5}
          /> : <p>Wait a minute you fuck</p>
        }
      </div>
    )
  }
}

export default ClCamera;