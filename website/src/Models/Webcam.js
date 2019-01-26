// src/webcam.js
export class Webcam {
  constructor(webcamElement, canvasElement) {
    this.webcamElement = webcamElement;
    this.canvasElement = canvasElement;
  }

  /**
   * @description adjusts the video element to be proportionate to the size you specified when creating videoElement
   * @param {*} width 
   * @param {*} height 
   */
  adjustVideoSize(width, height) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  /**
   * @description initializes the camera from the browser and assigns the video stream to your VideoElement
   * in the component. That means granting access to the camera and returning the videoStream 
   * function to you.
   */
  async setup() {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices.getUserMedia !== undefined) {
        navigator.mediaDevices.getUserMedia({
          audio: false, video: { facingMode: 'user' }
        })
          .then((mediaStream) => {
            if ("srcObject" in this.webcamElement) {
              this.webcamElement.srcObject = mediaStream;
            } else {
              // For older browsers without the srcObject.
              this.webcamElement.src = window.URL.createObjectURL(mediaStream);
            }
            this.webcamElement.addEventListener(
              'loadeddata',
              async () => {
                this.adjustVideoSize(
                  this.webcamElement.videoWidth,
                  this.webcamElement.videoHeight
                );
                resolve();
              },
              false
            );
          });
      } else {
        reject();
      }
    });
  }

  /**
   * @description takes the existing frame in videoElement when that function is called
   * and displays the image on canvasElement
   */
  _drawImage() {
    const imageWidth = this.webcamElement.videoWidth;
    const imageHeight = this.webcamElement.videoHeight;

    const context = this.canvasElement.getContext('2d');
    this.canvasElement.width = imageWidth;
    this.canvasElement.height = imageHeight;

    context.drawImage(this.webcamElement, 0, 0, imageWidth, imageHeight);
    return { imageHeight, imageWidth };
  }

  /**
   *  @description handle binary large object (blob) images or Base64 images, respectively.
   */
  takeBlobPhoto() {
    const { imageWidth, imageHeight } = this._drawImage();
    return new Promise((resolve, reject) => {
      this.canvasElement.toBlob((blob) => {
        resolve({ blob, imageHeight, imageWidth });
      });
    });
  }

  /**
   *  @description handle binary large object (blob) images or Base64 images, respectively.
   */
  takeBase64Photo({ type, quality } = { type: 'png', quality: 1 }) {
    const { imageHeight, imageWidth } = this._drawImage();
    const base64 = this.canvasElement.toDataURL('image/' + type, quality);
    return { base64, imageHeight, imageWidth };
  }
}
