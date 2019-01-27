from flask import Flask, jsonify
from flask import abort
from flask import request
import os
from google.cloud import vision
from google.cloud.vision import types
import base64
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= r"C:\Users\Adamd\Downloads\ConUHacks2019-a5def77905c5.json"


@app.route('/send_nudes', methods=['POST'])
def get_image():
    if not request.json or not 'image_data' in request.json:
        abort(400)
    image_data = {
    'image_data': request.json['image_data'],
    }
    data_to_send = image_data['image_data']
    resp = comp_vision(data_to_send)
    return jsonify(resp), 201


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




if __name__ == '__main__':
  app.run(debug=True)