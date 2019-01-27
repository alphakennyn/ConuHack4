from flask import Flask, jsonify
from flask import abort
from flask import request
import os
from google.cloud import vision
from google.cloud.vision import types
import base64
import json
from flask_cors import CORS
from google.cloud import automl_v1beta1
from google.cloud.automl_v1beta1.proto import service_pb2



app = Flask(__name__)
CORS(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= r"C:\Users\Adamd\Downloads\ConUHacks2019-a5def77905c5.json"
model_id = "ICN1038420248079975736"
project_id = "conuhacks2019-229817"



@app.route('/send_nudes', methods=['POST'])
def get_image():
    if not request.json or not 'image_data' in request.json:
        abort(400)
    image_data = {
    'image_data': request.json['image_data'],
    }
    data_to_send = image_data['image_data']
    resp = get_prediction(data_to_send, project_id, model_id)
    resp_json = {
        'display_name': resp.payload[0].display_name,
        'score': resp.payload[0].classification.score
    }
    return jsonify(resp_json), 201


def comp_vision(imgData):
    response_labels = []
    client = vision.ImageAnnotatorClient()
    content = base64.b64decode(imgData)
    image = types.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations
    print('Labels:')
    for label in labels:
        response_labels.append({
            'description': label.description,
            'score': label.score
        })
    temp = json.dumps(response_labels)
    print(temp)
    return response_labels

def get_prediction(imgData, project_id, model_id):
    content = base64.b64decode(imgData)
    prediction_client = automl_v1beta1.PredictionServiceClient()
    name = 'projects/{}/locations/us-central1/models/{}'.format(project_id, model_id)
    payload = {'image': {'image_bytes': content }}
    params = {}
    request = prediction_client.predict(name, payload, params)
    return request  # waits till request is returned



if __name__ == '__main__':
  app.run(debug=True)