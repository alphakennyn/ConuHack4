from flask import Flask, jsonify, send_from_directory, render_template, Blueprint
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



app = Flask( __name__, static_url_path='/build/static/',template_folder='build/')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # return render_template('index.html')
    if path != "" and os.path.exists("/build/" + path):
        return send_from_directory('/build/', path)
    else:
        return send_from_directory('/build/', 'index.html')

CORS(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= r"./configs/credentials.json"
model_id = "ICN1211232925210694624"
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
    comp_resp = comp_vision(request.json['image_data'])
    print(comp_resp)
    resp_json = {
        'display_name': resp.payload[0].display_name,
        'score': resp.payload[0].classification.score,
        'data_set': comp_resp
    }
    print(resp_json)
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
    app.run(use_reloader=True, port=5000, host='0.0.0.0', threaded=True)
    
