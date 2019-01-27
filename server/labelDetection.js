'use strict';

function compare(a, b){
  if(a.count < b.count){
    return -1;
  }
  if(a.count > b.count){
    return 1;
  }
  return 0;
}

async function dothejob(labelHitsConfidence, file) {
  try{
      //filelist.push(file);
  if(file[0] == '.'){
    return;
  }
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient();
  console.log('file name: ' + file);
  const [result] = await client.labelDetection(`./ressources/${file}`);
  const labels = result.labelAnnotations;
  labels.forEach(function (label) {
    //console.log(label.description);
    let seen = false;
    labelHitsConfidence.forEach(function (e) {
      if (e.label == label.description) {
        seen = true;
        e.averageConfidence = (e.averageConfidence * e.count + label.score) / (e.count + 1);
        e.count++;
        return;
      }
    });
    if (!seen) {
      labelHitsConfidence.push({
        label: label.description,
        averageConfidence: label.score,
        count: 1,
      });
    }
  });
  return labelHitsConfidence;
  }
  catch(e){
    console.log(e);
  }

}


async function detectLabels() {
  // Imports the Google Cloud client library
  //const vision = require('@google-cloud/vision');

  // Creates a client
  //const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file

  var labelHitsConfidence = [];

  var fs = fs || require('fs'), files = fs.readdirSync('./ressources');
  var filelist = filelist || [];
  var _res;
  files.forEach(function (file) {
    //labelHitsConfidence = 
    dothejob(labelHitsConfidence, file).then((res) => {
      //labelHitsConfidence.push
      console.log(res)
      //_res = res;
    });
  });

  return _res;
  //console.log(labelHitsConfidence);
  // const [result] = await client.labelDetection('./ressources/wakeupcat.jpg');
  // const labels = result.labelAnnotations;
  // console.log('Labels:');
  // labels.forEach(label => console.log(label.description));
}

detectLabels().catch(console.error);


async function koalskiAnalysis(){
  const _res = await detectLabels();
  console.log(_res);
  const sorted = _res.sort(compare);
  console.log('Labels:');
  console.log(sorted);
}

module.exports = koalskiAnalysis;