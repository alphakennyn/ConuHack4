import flask
from flask import jsonify
import json

from pprint import pprint

with open('data/recycle.json') as words:
    recycling = json.load(words)

with open('data/compost.json') as words:
    compost = json.load(words)

with open('data/example.json') as words:
    example = json.load(words)

def helper(str1, str2):
    if ((str2.len-(2*str1.len())<0) and str1.upper() in str2.lower()):
        return True


def filter(example):
    reCount=0
    compCount=0

    for word in compost:
        for k in example:
            if k['description'].upper() in word.upper():
                compCount+=1
    if compCount>0:
        return "compost"

    for word in recycling:
        for k in example:
             if k['description'].upper() in word.upper():
                dontCount+=1

    if reCount>0:
        return "recycling"
    return "garbage"

response={"type":filter(example)}

flask.jsonify(response)