import sys
import os
import base64
from google.cloud import automl_v1beta1
from google.cloud.automl_v1beta1.proto import service_pb2

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= r"C:\Users\Adamd\Downloads\ConUHacks2019-a5def77905c5.json"

def get_prediction(content, project_id, model_id):
  prediction_client = automl_v1beta1.PredictionServiceClient()
  name = 'projects/{}/locations/us-central1/models/{}'.format(project_id, model_id)
  payload = {'image': {'image_bytes': content }}
  params = {}
  request = prediction_client.predict(name, payload, params)
  print(request)
  return request  # waits till request is returned

if __name__ == '__main__':
  model_id = "ICN1038420248079975736"
  project_id = "conuhacks2019-229817"
  print(get_prediction(content, project_id,  model_id))