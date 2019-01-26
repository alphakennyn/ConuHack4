import React, { Component } from 'react';
import { Webcam } from './Models/Webcam';
//import './ClCamera.css';

class ClCamera extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.state = {
      capturedImage: null,
      captured: false,
      uploading: false
    }
  }

  componentDidMount() {
    // initialize the camera
    this.canvasElement = document.createElement('canvas');
    this.webcam = new Webcam(
      document.getElementById('webcam'),
      this.canvasElement
    );
    this.webcam.setup().catch(() => {
      alert('Error getting access to your camera');
    });
  }

  captureImage = async () => {
    const capturedData = this.webcam.takeBase64Photo({ type: 'jpeg', quality: 0.8 });
    this.setState({
      captured: true,
      capturedImage: capturedData.base64
    });
  }

  discardImage = () => {
    this.setState({
      captured: false,
      capturedImage: null
    })
  }

  uploadImage = () => {
    if (this.props.offline) {
      console.log("you're using in offline mode sha");
      // create a random string with a prefix
      const prefix = 'cloudy_pwa_';
      // create random string
      const rs = Math.random().toString(36).substr(2, 5);
      localStorage.setItem(`${prefix}${rs}`, this.state.capturedImage);
      alert('Image saved locally, it will be uploaded to your Cloudinary media library once internet connection is detected');
      this.discardImage();
      // save image to local storage
    } else {
      this.setState({ 'uploading': true });
      // axios.post(
      //   `https://api.cloudinary.com/v1_1/CLOUDINARY_CLOUD_NAME/image/upload`,
      //   {
      //     file: this.state.capturedImage,
      //     upload_preset: 'CLOUDINARY_CLOUD_PRESET'
      //   }
      // ).then((data) => this.checkUploadStatus(data)).catch((error) => {
      //   alert('Sorry, we encountered an error uploading your image');
      this.setState({ 'uploading': false });
      // });
    }
  }

  findLocalItems = (query) => {
    let i;
    let results = [];
    for (i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        if (i.match(query) || (!query && typeof i === 'string')) {
          const value = localStorage.getItem(i);
          results.push({ key: i, val: value });
        }
      }
    }
    return results;
  }

  checkUploadStatus = (data) => {
    this.setState({ 'uploading': false });
    if (data.status === 200) {
      alert('Image Uploaded to Cloudinary Media Library');
      this.discardImage();
    } else {
      alert('Sorry, we encountered an error uploading your image');
    }
  }


  render() {
    const imageDisplay = this.state.capturedImage ?
      <img src={this.state.capturedImage} alt="captured" width="350" />
      :
      <span />;

    const buttons = this.state.captured ?
      <div>
        <button className="deleteButton" onClick={this.discardImage} > Delete Photo </button>
        {/* <button className="captureButton" onClick={this.uploadImage} > Upload Photo </button> */}
      </div> :
      <button className="captureButton" onClick={this.captureImage} > Take Picture </button>

    const uploading = this.state.uploading ?
      <div><p> Uploading Image, please wait ... </p></div>
      :
      <span />

    return (
      <div>
        {uploading}
        <video autoPlay playsInline muted id="webcam" width="100%" height="200" />
        <br />
        <div className="imageCanvas">
          {imageDisplay}
        </div>
        {buttons}
      </div>
    )
  }
}

export default ClCamera;