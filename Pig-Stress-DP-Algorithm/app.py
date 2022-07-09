isPi = False

from datetime import datetime, timedelta
from flask import Response, request
from flask import Flask
import threading
import time, socket
import cv2
import logging

if isPi:
    from cameras.cam_normal import Cam_Norm
    from cameras.cam_thermal import cam_therm

from component.r_controller import r_controller
from action.a_controller import a_controller
from cust_utils.utils import mongoResToJson
import numpy as np
import pymongo
import atexit
from flask_cors import CORS
import os
from datetime import datetime
import cv2
import torch
import numpy as np
import warnings
import pickle
import tensorflow as tf

warnings.filterwarnings("ignore") # Warning will make operation confuse!!!
tf.get_logger().setLevel(logging.ERROR)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'


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
EMERGENCY_STOP=False

Yolov5_PHD=None
PHS_CNN=None

MONGO_CONNECTION=None

if isPi:
   MONGO_CONNECTION=pymongo.MongoClient("mongodb://localhost:27017")
else:
   MONGO_CONNECTION=pymongo.MongoClient("mongodb+srv://Jervx:helloworld@capstone.nv1cu.mongodb.net/?retryWrites=true&w=majority") 

DB = MONGO_CONNECTION["PHS_MACHINE"]
DB_CONFIGS = DB['configs']
DB_DETECTIONS = DB['thermal_detections']

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

def conv_img(img):
    new_img = cv2.resize(img, 120,120)
    return np.array(new_img).reshape(-1, 120, 120, 1)

def detectHeatStress():
    global IMG_NORMAL_ANNOTATED, PHS_CNN, IMG_NORMAL, IMG_THERMAL, RAW_THERMAL, Yolov5_PHD
    while True and isPi:
        loadDbConfig()
        if IMG_NORMAL is not None and IMG_THERMAL is not None:
            c_IMG_NORMAL = IMG_NORMAL
            c_IMG_THERMAL = IMG_THERMAL
            c_RAW_THERMAL = RAW_THERMAL
            c_Raw_Reshaped = np.reshape(c_RAW_THERMAL.copy(), (24,32))
            c_Raw_Reshaped = cv2.resize(c_Raw_Reshaped, (640, 480))

            to_read = c_IMG_NORMAL.copy()
            
            print("Detecting Pig")
            detect_pig_head = Yolov5_PHD(to_read) 
            print("Done Detect")
            print("Returned Bbox", detect_pig_head)

            coords = detect_pig_head.pandas().xyxy[0].to_dict(orient="records")
        
            if len(coords) > 0:
                detect_annotation = np.squeeze(detect_pig_head.render())
                
                print("Saving Detection", len(coords))

                img_normal_cropped = []
                img_thermal_cropped = []
                img_thermal_cropped_raw = []


                detected = False
                
                for result in coords:
                    x1 = int(result['xmin'])
                    y1 = int(result['ymin'])
                    x2 = int(result['xmax'])
                    y2 = int(result['ymax'])
                    # print(x1,y1,x2,y2)
                    cpy_thrm_crop_raw = c_Raw_Reshaped[y1:y2, x1:x2]

                    # detection = CNN ( RAW THERMAL )
                    conv_img = conv_img(cpy_thrm_crop_raw)
                    identify_pig_stress = PHS_CNN.predict(conv_img)
                    classes =  ['Heat Stressed', 'Normal']
                    classification = classes[np.argmax(res)]

                    if classification == classes[1]:
                        continue
                        
                    detected = True
                    # If it does classified stressed then set as detected to true

                    cpy_crop_normal = c_IMG_NORMAL[y1 : y2, x1 : x2]
                    cpy_thrm_crop = c_IMG_THERMAL[y1 : y2, x1 : x2]

                    img_thermal_cropped_raw.append(cpy_thrm_crop_raw)
                    img_normal_cropped.append(cpy_crop_normal)
                    img_thermal_cropped.append(cpy_thrm_crop)

                curt = datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")

                if detected:
                    # Save Data to nextjs server
                    saveDetection(c_IMG_NORMAL, c_IMG_THERMAL, c_RAW_THERMAL, detect_annotation, curt, img_normal_cropped, img_thermal_cropped, img_thermal_cropped_raw, len(coords))
                    with lock:
                        SYSTEM_STATE['status'] = 1
                    # Do actions bind on Heat Stress Detection
                    if not EMERGENCY_STOP:
                        print('do action here later')

                with lock:
                    IMG_NORMAL_ANNOTATED = detect_annotation
                    SYSTEM_STATE['pig_count'] = len(coords)

            else:
                with lock:
                    SYSTEM_STATE['pig_count'] = 0

def saveDetection(normal, thermal, raw_thermal, normal_annotated, stmp, croped_normal, croped_thermal, croped_thermal_raw, total_pig):
    try:
        path1 = f"../phsmachine_web/public/detection/Detection-{stmp}"
        path2 = f"../phsmachine_web/public/detection/Detection-{stmp}/Target"

        server_path = f"/detection/Detection-{stmp}"

        os.makedirs(path1)
        os.makedirs(path2)

        DATA_DICT =  {
            "img_normal": f"{server_path}/img_normal.png",
            "img_annotated": f"{server_path}/img_annotated.png",
            "img_thermal": f"{server_path}/img_thermal.png",
            "data": {
                "pig_count": total_pig,
                "stressed_pig": len(croped_normal),
                "breakdown": [],
            },
            "actions": [
                {
                    "action": "Mist",
                    "duration": 10,
                },
                {
                    "action": "Fan",
                    "duration": 20,
                },
            ]
        }

        x = 1
        print("RANGE", len(croped_normal))
        for i in range(len(croped_normal)):
            cv2.imwrite(f"{path2}/pig-{x}.png", croped_normal[i])
            cv2.imwrite(f"{path2}/pig-thermal-processed{x}.png", croped_thermal[i])
            cv2.imwrite(f"{path2}/pig-thermal-unprocessed{x}.png", croped_thermal_raw[i])

            DATA_DICT['data']['breakdown'].append(
                {
                    "normal_thumb": f"{server_path}/Target/pig-{x}.png",
                    "thermal_thumb": f"{server_path}/Target/pig-thermal-processed{x}.png",
                    "thermal_raw_thumb": f"{server_path}/Target/pig-thermal-unprocessed{x}.png",
                }
            )

            x+=1

        print(DATA_DICT)
        
        print("Saving Real Rec")
        cv2.imwrite(f"{path1}/img_normal.png", normal)
        cv2.imwrite(f"{path1}/img_annotated.png", normal_annotated)
        cv2.imwrite(f"{path1}/img_thermal.png", thermal)

        DB_DETECTIONS.insert_one( DATA_DICT )

        p = pickle.dump( raw_thermal, open(f'../phsmachine_web/public/detection/Detection-{stmp}/raw_thermal.pkl', 'wb'))
        print("SAVED")
    except Exception as e:
        print(e)

def updateJobs():
    global SYSTEM_STATE

    if EMERGENCY_STOP:
        SYSTEM_STATE['jobs'] = []

    for idx, job in enumerate(SYSTEM_STATE['jobs']):
        endTime = jobs['end']
        curTime = datetime.now()
        if curTime >= curTime:
            print('end action')
            R_CONTROLLER.toggleRelay(job['name'],False)
            SYSTEM_STATE['jobs'].pop(idx)
        else:
            print('on action ', job['name'])
            R_CONTROLLER.toggleRelay(job['name'],True)


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
        if len(R_CONTROLLER.getAllRelays()) != len(relays) and isPi:
            R_CONTROLLER.delRelays(relays)      
    else:
        R_CONTROLLER = r_controller(relays, True, isPi)
        # R_CONTROLLER = None

    if len(ACTION_STATE.actions) != len(actions) and isPi:
        ACTION_STATE = a_controller(actions, ACTION_STATE.actions)

    updateJobs()
        
def start_server():
    global Yolov5_PHD, PHS_CNN, YOLO_DIR, WEIGHTS_DIR ,ACTION_STATE, CAM_THERMAL, CAM_NORMAL, RAW_THERMAL, SYSTEM_STATE, R_CONTROLLER, IMG_NORMAL_ANNOTATED

    SYSTEM_STATE = {
        "status" : 0,
        "active_actions" : "None",
        "lighting" : "Off",
        "pig_count" : 0,
        "stressed_pigcount" : 0,
        "max_temp" : 0,
        "average_temp" : 0,
        "min_temp" : 0,
        "jobs" : []
    }
    
    if isPi:
        CAM_THERMAL = cam_therm()
        CAM_NORMAL = Cam_Norm()
        time.sleep(0.1)

    ACTION_STATE = a_controller((),())

    loadDbConfig()

    RAW_THERMAL = np.zeros((24*32,))        
    try:
        Yolov5_PHD = torch.hub.load(
                YOLO_DIR,
                'custom',
                path=WEIGHTS_DIR, 
                source='local',
                device = 'cpu',
                force_reload=True
            )
        print("done loading yolo")
    except Exception as e:
        print("ERROR PHS YOLO V5",e)

    print("Loading PHS Heat Stress CNN..")

    PHS_CNN = tf.keras.models.load_model(os.path.join('models','mai_Net.h5'))

    print("Loaded PHS Heat Stress CNN!")

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

@atexit.register
def goodbye():
    global R_CONTROLLER
    print("\n")
    print("---PHS STATE OFF---")
    print("Setting state as Off")
    print("Closing Relays")
    if isPi:
        R_CONTROLLER.offAll()

if __name__ == '__main__':
	start_server()
