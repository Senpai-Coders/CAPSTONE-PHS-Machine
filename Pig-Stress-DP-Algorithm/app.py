from urllib import response
from flask import Response, request
from flask import Flask
import flask
from flask import render_template
import threading
import time, socket, logging, traceback
import cv2
from cameras.cam_normal import Cam_Norm
from cameras.cam_thermal import cam_therm
import numpy as np
from bson import json_util
import pymongo
from cust_utils.utils import mongoResToJson
from component.r_controller import r_controller
from action.a_controller import a_controller
import atexit
from flask_cors import CORS
import os
from datetime import datetime
import cv2
import torch
from matplotlib import pyplot as plt
from PIL import Image
import numpy as np
import warnings
import pickle

warnings.filterwarnings("ignore") # Warning will make operation confuse!!!

YOLO_DIR = os.path.join('models','yolov5')
WEIGHTS_DIR = os.path.join('best.pt')


IMG_NORMAL=None
IMG_THERMAL=None
RAW_THERMAL=None
IMG_NORMAL_ANNOTATED=None

CAM_THERMAL=None
CAM_NORMAL=None

SYSTEM_STATE=None
ACTION_STATE=None
R_CONTROLLER=None

Yolov5_PHD=None

MONGO_CONNECTION=pymongo.MongoClient("mongodb://localhost:27017")
DB = MONGO_CONNECTION["PHS_MACHINE"]
DB_CONFIGS = DB['configs']

lock = threading.Lock()

app = Flask(__name__)
cors = CORS(app, resources={f"/*":{"origins":"*"}})
#mongo = PyMongo(app, uri="mongodb://localhost:27017/PHS_MACHINE")

@app.route("/")
def index():
	return "Hello"

# @app.route("/getConfig")
# def getConfig():
#     configs = list(DB_CONFIGS.find({'config_name' : 'system_state'}))
#     return Response(mongoResToJson(configs), content_type='application/json'), 200

@app.route("/getSystemState")
def getSyState():
    global SYSTEM_STATE
    response = Response(mongoResToJson({ "state" : SYSTEM_STATE }), content_type='application/json' )
    return response, 200

@app.route("/getActionState")
def getActionState():
    global SYSTEM_STATE
    response = Response(mongoResToJson({ "actions" : ACTION_STATE.toDict() }), content_type='application/json' )
    return response, 200

@app.route("/updateActionState", methods=['POST'])
def setActionState():
    global ACTION_STATE
    ReqBod = request.get_json(force=True)
    config_name = ReqBod['config_name']
    state = ReqBod['state']
    ACTION_STATE.toggle(config_name, state)
    return "ok",200

@app.route("/updateState")
def setState():
    global SYSTEM_STATE
    status = request.args.get('status')
    SYSTEM_STATE['status']=int(status)
    response = Response( mongoResToJson({"status":200, "message":"Ok "}) , content_type="application/json")
    return response, 200

@app.route("/emitRelay", methods=['POST'])
def emitRelay():
    global R_CONTROLLER
    ReqBod = request.get_json(force=True)
    target = ReqBod['relay_name']
    state = ReqBod['state']
    print("REQ",target,state)
    R_CONTROLLER.toggleRelay(target,state)
    response = Response( mongoResToJson({"status":200, "message":"Ok "}) , content_type="application/json")
    return response, 200

@app.route("/getAllRelays", methods=['GET'])
def getAvailableRelay():
    global R_CONTROLLER
    res = Response(mongoResToJson(R_CONTROLLER.getAllRelays()), content_type='application/json' )
    res.headers.add("Access-Control-Allow-Origin", "*")
    return res, 200

@app.route("/normal_feed")
def feed_normal():
	return Response(gen_normal(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route("/thermal_feed")
def feed_thermal():
	return Response(gen_thermal(), mimetype="multipart/x-mixed-replace; boundary=frame")  

@app.route("/annotate_feed")
def feed_annotate():
	return Response(gen_annotate(), mimetype="multipart/x-mixed-replace; boundary=frame")  

def get_ip_address():
	"""Find the current IP address of the device"""
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("8.8.8.8", 80))
	ip_address=s.getsockname()[0]
	s.close()
	return ip_address

def detectHeatStress():
    loadDbConfig()
    global IMG_NORMAL_ANNOTATED, IMG_NORMAL, IMG_THERMAL, RAW_THERMAL, Yolov5_PHD
    while True:
        if IMG_NORMAL is not None and IMG_THERMAL is not None:
            c_IMG_NORMAL = IMG_NORMAL
            c_IMG_THERMAL = IMG_THERMAL
            c_RAW_THERMAL = RAW_THERMAL

            to_read = c_IMG_NORMAL.copy()
            
            print("Detecting Pig")
            detect_pig_head = Yolov5_PHD(to_read) 
            print("Done Detect")
            print("Returned Bbox", detect_pig_head)
            detect_pig_head.pred
            detect_annotation = np.squeeze(detect_pig_head.render())

            with lock:
                if len(detect_pig_head.pred) >= 1:
                    print("Saving Detection")
                    IMG_NORMAL_ANNOTATED = detect_annotation
                    curt = datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")
                    saveDetection(c_IMG_NORMAL, c_IMG_THERMAL, c_RAW_THERMAL, detect_annotation, curt)
                else:
                    print("No Detection")

def readCams():
    global IMG_NORMAL, CAM_THERMAL, CAM_NORMAL, IMG_THERMAL, RAW_THERMAL, SYSTEM_STATE
    while CAM_THERMAL is not None:
        current_frame=None
        thermal_frame=None
        raw_thermal=None
        try:
            current_frame, byts = CAM_NORMAL.get_frame()
            raw, raw_rescaled, processed = CAM_THERMAL.getThermal()
            thermal_frame = processed
            raw_thermal = raw
            SYSTEM_STATE['max_temp'] = round(np.max(raw),2)
            SYSTEM_STATE['average_temp'] = round(np.mean(raw), 2)
            SYSTEM_STATE['min_temp'] = round(np.min(raw), 2)

        except Exception:
            print("Too many retries error caught; continuing...")
        if current_frame is not None and thermal_frame is not None:
            with lock:
                IMG_NORMAL = current_frame.copy()
                IMG_THERMAL = thermal_frame.copy()
                RAW_THERMAL = raw_thermal.copy()

def gen_annotate():
	global IMG_NORMAL_ANNOTATED, lock
	while True:
		with lock:
			if IMG_NORMAL_ANNOTATED is None:
				continue
			(flag, encodedImage) = cv2.imencode(".jpg", IMG_NORMAL_ANNOTATED)
			if not flag:
				continue
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

def gen_normal():
	global IMG_NORMAL, lock
	while True:
		with lock:
			if IMG_NORMAL is None:
				continue
			(flag, encodedImage) = cv2.imencode(".jpg", IMG_NORMAL)
			if not flag:
				continue
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

def gen_thermal():
	global IMG_THERMAL, lock
	while True:
		with lock:
			if IMG_THERMAL is None:
				continue
			(flag, encodedImage) = cv2.imencode(".jpg", IMG_THERMAL)
			if not flag:
				continue
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

def loadDbConfig():
    global R_CONTROLLER, SYSTEM_STATE, ACTION_STATE
    relays = list(DB_CONFIGS.find({ "category" : "relays" }))
    actions = list(DB_CONFIGS.find({ "category" : "actions", "disabled" : False }))

    if R_CONTROLLER is not None:
        if len(R_CONTROLLER.getAllRelays()) != len(relays):
            R_CONTROLLER.delRelays(relays)      
    else:
        R_CONTROLLER = r_controller(relays, True)

    if len(ACTION_STATE.actions) != len(actions):
        ACTION_STATE = a_controller(actions, ACTION_STATE.actions)
        
def start_server():
    global Yolov5_PHD, YOLO_DIR, WEIGHTS_DIR ,ACTION_STATE, CAM_THERMAL, CAM_NORMAL, RAW_THERMAL, SYSTEM_STATE, R_CONTROLLER, IMG_NORMAL_ANNOTATED

    SYSTEM_STATE = {
        "status" : 0,
        "active_actions" : "None",
        "lighting" : "Off",
        "pig_count" : 0,
        "stressed_pigcount" : 0,
        "max_temp" : 0,
        "average_temp" : 0,
        "min_temp" : 0
    }
    ACTION_STATE = a_controller((),())
    loadDbConfig()

    RAW_THERMAL = np.zeros((24*32,))
    CAM_THERMAL = cam_therm()
    CAM_NORMAL = Cam_Norm()
    time.sleep(0.1)

    Yolov5_PHD = torch.hub.load(
        YOLO_DIR,
        'custom',
        path=WEIGHTS_DIR, 
        source='local',
        device = 'cpu',
        force_reload=True
    )

    camThread = threading.Thread(target=readCams)
    camThread.daemon = True
    camThread.start()

    detectThread = threading.Thread(target=detectHeatStress)
    detectThread.daemon = True
    detectThread.start()

    ip=get_ip_address()
    port=8000
    print(f'Server can be found at {ip}:{port}')
    app.run(host=ip, port=port, debug=True, threaded=True, use_reloader=False)

def saveDetection(normal, thermal, raw_thermal, normal_annotated,stmp):
    try:
        os.makedirs(f"../phsmachine_web/public/detection/Detection-{stmp}")
        
        cv2.imwrite(f"../phsmachine_web/public/detection/Detection-{stmp}/img_normal.png", normal)
        cv2.imwrite(f"../phsmachine_web/public/detection/Detection-{stmp}/img_annotated.png", normal_annotated)
        cv2.imwrite(f"../phsmachine_web/public/detection/Detection-{stmp}/img_thermal.png", thermal)

        p = pickle.dump( raw_thermal, open(f'../phsmachine_web/public/detection/Detection-{stmp}/raw_thermal.pkl', 'wb'))
        p.close()
        print("SAVED")
    except Exception as e:
        print(e)

@atexit.register
def goodbye():
    global R_CONTROLLER
    print("\n")
    print("---PHS STATE OFF---")
    print("Setting state as Off")
    print("Closing Relays")
    R_CONTROLLER.offAll()

if __name__ == '__main__':
	start_server()
