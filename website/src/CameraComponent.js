import React, { Component } from 'react';
import axios from 'axios';

//import Camera from 'react-html5-camera-photo';
import Camera from "react-webcam";
import SweetAlert from 'sweetalert2-react';

//import 'react-html5-camera-photo/build/css/index.css';
import './Camera.css';
import url from './configs/url.json';
import facts from './configs/facts.json';
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
      if (res.status ===  201) {
        const { display_name, score, data_set } = res.data;
        const dataFound = process.env.NODE_ENV === 'development' ? data_set.reduce((acc, value) => {
          acc += `</br><b>${value.description}</b> confident: ${value.score.toFixed(5)}`;
          return acc;
        }, '') : '';

        if (display_name === "other") {
          result.passed = true;
          result.title = 'Warning';
          result.type = 'warning';
          result.message = `The item in focus does not seem disposable.</br></br>Please focus the camera on the piece of garbage</br></br>${dataFound}`;
        } else {
          result.passed = true;
          result.title = display_name.toUpperCase();
          result.type = 'success';
          
 
          
          const factsList = facts.facts;
          const factToDisplay = factsList[Math.floor((Math.random() * factsList.length))]
          
          result.message = `<br/><br/><b>Confidence level: ${score.toFixed(5)}</b></br>${dataFound}</br></br><i>${factToDisplay}</i>`;
        } 
      
      } else {
        throw new Error(`Not 201 ${res.status}` );
      }
    }).catch((err) => {
        result.passed = false;
        result.title = 'Error';
        result.type = 'error';
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
    const mirror = this.constructor.isMobile() ? {} : { transform: 'scaleX(-1)' };

    return (
      <div className="app-container"
        onDoubleClick={() => 
          this.onTakePhoto()
        }
      >
        <SweetAlert
          show={!!this.state.result.type}
          title={this.state.result.title}
          html={this.state.result.message}
          type={this.state.result.type}
          onConfirm={() => this.setState({ result: '' })}

        />
        {/* <SweetAlert
          show={this.state.result.message && !this.state.result.passed}
          title={this.state.result.title}
          html={this.state.result.message}
          type={this.state.result.type}
          onConfirm={() => this.setState({ result: '' })}

        /> */}
        { this.state.showCamera ? 
          <div><Camera
            audio={false}
            ref={this.setRef}
            style={mirror}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: width,
              height: height,
              facingMode: "environment"
            }}
          />        
          <img src={icon} alt="button" id="img-button" onClick={() => this.onTakePhoto()}/></div>
          : <img id="img-loader" src={icon} alt="loader" />
        }
      </div>
    )
  }
}

export default ClCamera;
