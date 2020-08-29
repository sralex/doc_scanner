#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import render_template
from flask import Flask, flash, request
import json
from werkzeug.utils import secure_filename
import io
import numpy as np
from PIL import Image
import os

from skimage import transform as tf

import base64

ALLOWED_EXTENSIONS = {'jpg','png','jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__,static_url_path='/static')

def img_to_base64_str( img):
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    buffered.seek(0)
    return "data:image/jpeg;base64,{}".format(base64.b64encode(buffered.getvalue()).decode())


@app.route('/create',methods=['POST'])
def create():

    file = request.files['file']

    real_points = np.array(json.loads(request.form['coord'])["values"])

    if file.filename == '':
        response = app.response_class(
            response=json.dumps({"error":"No selected file"}),
            status=401,
            mimetype='application/json'
        )
        return response


    if file and allowed_file(file.filename):
        img = Image.open(io.BytesIO(file.stream.read()))

        data = np.asarray( img, dtype="int32" )

        src = np.array([[0, 0], [0, data.shape[0]], [data.shape[1], 0], [data.shape[1], data.shape[0]]])

        x_max, x_min = np.max(real_points[0,:]), np.min(real_points[0,:])

        y_max, y_min = np.max(real_points[1,:]), np.min(real_points[1,:])

        dst = np.array([real_points[0],real_points[3],real_points[1],real_points[2]])

        tform3 = tf.ProjectiveTransform()

        tform3.estimate(src, dst)

        warped = tf.warp(data, tform3)

        result = warped / np.max(warped) * 255

        encoded_string = img_to_base64_str(Image.fromarray(np.uint8(result)))

        response = app.response_class(
            response=json.dumps({"encoded":str(encoded_string)}),
            status=201,
            mimetype='application/json'
        )
        return response

    response = app.response_class(
            response=json.dumps({"error":"No allowed file"}),
            status=404,
            mimetype='application/json'
        )
    return response

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'O$%7kQgXKVOhT@refsbY;mQmt9lMWg')
    port = os.getenv('PORT', 9001)
    print('port=', port)
    app.run(host='0.0.0.0', debug=True, port=port)
