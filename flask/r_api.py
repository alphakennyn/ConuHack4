from flask import Flask, jsonify
from flask import abort
from flask import request
from flask_httpauth import HTTPBasicAuth, make_response
app = Flask(__name__)


@app.route('/image_data', methods=['POST'])
def get_image():
    if not request.json or not 'image_data' in request.json:
        abort(400)
    image_data = {
    'image_data': request.json['image_data'],
    }
    return jsonify(image_data), 201


if __name__ == '__main__':
  app.run(debug=True)