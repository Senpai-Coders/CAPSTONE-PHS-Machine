from datetime import datetime, timedelta 
import time
from flask import Response, request
from flask import Flask
import threading
import time, socket
import cv2
import logging
import math
import requests
from cameras.cam_normal import Cam_Norm
from cameras.cam_thermal import cam_therm
from cameras.cam_normal import Cam_Norm
from component.r_controller import r_controller
from action.a_controller import a_controller
from cust_utils.utils import mongoResToJson
import numpy as np
import pymongo
from pymongo.errors import ConnectionFailure
import atexit
from flask_cors import CORS
import os
from datetime import datetime
import cv2
import torch
import numpy as np
import warnings
import tensorflow as tf
import json
import sys
from signal import signal, SIGTERM, SIGHUP
from rpi_lcd import LCD

warnings.filterwarnings("ignore") # Warning will make operation confuse!!!
#tf.get_logger().setLevel(logging.ERROR)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

font = cv2.FONT_HERSHEY_SIMPLEX

_SELFPATH_ = os.path.dirname(__file__)
_LCD = None
_SELF_IP = ''

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)
FORMATTER = logging.Formatter('%(asctime)s | %(levelname)s | %(message)s')

def updateLoggerHandler():
    global LOGGER, FORMATTER
    LOGGER.handlers.clear()
    file_handler = logging.FileHandler(os.path.join(_SELFPATH_, '../phsmachine_web/public/logs/core/{:%Y-%m-%d}.log'.format(datetime.now())))
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(FORMATTER)
    LOGGER.addHandler(file_handler)

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.DEBUG)
    stdout_handler.setFormatter(FORMATTER)

    LOGGER.addHandler(stdout_handler)

YOLO_DIR = os.path.join(_SELFPATH_, 'models','Yolov5')
WEIGHTS_DIR = ""
PHS_CNN_DIR = ""

EXITING = False

IMG_NORMAL=None
IMG_THERMAL=None
RAW_THERMAL=None
IMG_NORMAL_ANNOTATED=None

CAM_THERMAL=None
CAM_NORMAL=None

SYSTEM_STATE=None
UPDATE_STAMP=None
ACTION_STATE=None
R_CONTROLLER=None
EMERGENCY_STOP=False

#Identifies if PHS should use AI else use temperature threshold instead
DETECTION_MODE=False
TEMPERATURE_THRESHOLD=38.5
AUTODELETE= True
CANSAVE= True

# For PHS Area Tracking & Action Location
GRID_COL=1
GRID_ROW=1

Yolov5_PHD=None
PHS_CNN=None

MONGO_CONNECTION=None

def errorWrite( new_error ):
    error_logs = readError()

    doesExist = False

    # unique error code only
    for errors in error_logs:
        if errors['additional']['error_code'] == new_error['additional']['error_code']:
            doesExist = True
            break

    if doesExist: return

    error_logs.append(new_error)
    with open(os.path.join(_SELFPATH_,'../phsmachine_web/public/logs/error-logs.json'), 'w', encoding='utf-8') as f:
        json.dump(error_logs, f, ensure_ascii=False, indent=4 )
        f.close()

def deleteErrorCode ( code ):
    error_logs = readError()

    toWrite = []

    # unique error code only
    for errors in error_logs:
        if errors['additional']['error_code'] != code:
            toWrite.append(errors)

    with open(os.path.join(_SELFPATH_,'../phsmachine_web/public/logs/error-logs.json'), 'w', encoding='utf-8') as f:
        json.dump(toWrite, f, ensure_ascii=False, indent=4 )
        f.close()

def readError():
    try:
        f = open(os.path.join(_SELFPATH_,'../phsmachine_web/public/logs/error-logs.json'), 'r')
        f.close()
    except:
        with open(os.path.join(_SELFPATH_,'../phsmachine_web/public/logs/error-logs.json'), 'w+', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=4 )
            f.close()

    try:
        f = open(os.path.join(_SELFPATH_,'../phsmachine_web/public/logs/error-logs.json'))
        data = json.load(f)
        return data
    except:
        return []

try:
    MONGO_CONNECTION=pymongo.MongoClient("mongodb://localhost:27017")
    deleteErrorCode(2)
except Exception as e:
    errorWrite({
        "_id" : f'{datetime.now()}-LOCAL',
        "notification_type" : "error",
        "title": "PHS Core Database Error",
        "message": "PHS Core Database is not responding or possible not running, try restarting phs. Read description about error code on manual",
        "additional": {
            "error_code": 2,
            "severity": "high",
            "error_log": ("Error : {0}".format(str(e))),
        },
        "priority": 0,
        "links" : [],
        "seenBy" : [],
        "date" : f'{datetime.now()}',
    })


DB = MONGO_CONNECTION["PHS_MACHINE"]
DB_CONFIGS = DB['configs']
DB_DETECTIONS = DB['thermal_detections']
DB_NOTIFICATION = DB['notifications']

STREAM_REQ_THERM = False
STREAM_REQ_NORM = False
STREAM_REQ_ANNOT = False

THERM_STREAM_UP = 0
THERM_STREAM_CHECK = 0

NORM_STREAM_UP = 1
NORM_STREAM_CHECK = 1

ANNOT_STREAM_UP = 2
ANNOT_STREAM_CHECK = 2

lock = threading.Lock()

app = Flask(__name__)
cors = CORS(app, resources={f"/*":{"origins":"*"}})

@app.route("/")
def index():
	return "Hello"

@app.route("/getSystemState")
def getSyState():
    global SYSTEM_STATE
    response = Response(mongoResToJson({ "state" : SYSTEM_STATE }), content_type='application/json' )
    return response, 200

@app.route("/emergencyStop")
def setEmergencyStop():
    global EMERGENCY_STOP, SYSTEM_STATE, LOGGER
    with lock:
        EMERGENCY_STOP = True
        SYSTEM_STATE['status'] = -1
        print("Update State @ /emergencyStop")
    LOGGER.info(f"PHS EMERGENCY STOP")
    response = Response(mongoResToJson({ "message" : "ok" }), content_type='application/json')
    return response, 200

@app.route("/getActionState")
def getActiGonState():
    global SYSTEM_STATE

    response = Response(mongoResToJson({ "actions" : ACTION_STATE.toDict() }), content_type='application/json' )
    return response, 200

# @app.route("/updateActionState", methods=['POST'])
# def setActionState():
#     global ACTION_STATE
#     ReqBod = request.get_json(force=True)
#     config_name = ReqBod['config_name']
#     state = ReqBod['state']
#     ACTION_STATE.toggle(config_name, state)
#     return "ok",200

@app.route("/updateState")
def setState():
    global SYSTEM_STATE, R_CONTROLLER, ACTION_STATE, EMERGENCY_STOP, LOGGER, lock
    # -2 Off
    # -1 Disabled
    # 0 Detecting
    # 1 Resolving
    # 2 Debugging
    # 3 Connecting
    status = request.args.get('status')
    LOGGER.info(f"PHS Updated System State to -> {status}")
    with lock:
            if(int(status) == 2 or int(status == -1)):
                SYSTEM_STATE['jobs'] = []
                R_CONTROLLER.offAll()
                ACTION_STATE.offAll()
            elif int(status) == 0:
                R_CONTROLLER.offAll()
                EMERGENCY_STOP = False
            SYSTEM_STATE['status']=int(status)
            print("Update State @ updateState")
    response = Response( mongoResToJson({"status":200, "message":"Ok "}) , content_type="application/json")
    return response, 200

@app.route("/emitRelay", methods=['POST'])
def emitRelay():
    global R_CONTROLLER, LOGGER
    ReqBod = request.get_json(force=True)
    target = ReqBod['relay_name']
    state = ReqBod['state']
    LOGGER.info(f"Manual Relay Activation {target} -> {state}")
    R_CONTROLLER.toggleRelay(target,state)

    response = Response( mongoResToJson({"status":200, "message":"Ok "}) , content_type="application/json")
    return response, 200

@app.route("/getAllRelays", methods=['GET'])
def getAvailableRelay():
    global R_CONTROLLER
    res = Response(mongoResToJson(R_CONTROLLER.getAllRelays()), content_type='application/json' )
    res.headers.add("Access-Control-Allow-Origin", "*")
    return res, 200

# STREAM ROUTES

@app.route("/normal_feed")
def feed_normal():
    global STREAM_REQ_NORM
    with lock:
        STREAM_REQ_NORM = True
    return Response(gen_normal(), mimetype="multipart/x-mixed-replace; boundary=frame")
    with lock:
        STREAM_REQ_NORM = False

@app.route("/thermal_feed")
def feed_thermal():
    global STREAM_REQ_THERM
    with lock:
        STREAM_REQ_THERM = True
    return Response(gen_thermal(), mimetype="multipart/x-mixed-replace; boundary=frame")  
    with lock:
        STREAM_REQ_THERM = False

@app.route("/annotate_feed")
def feed_annotate():
    global STREAM_REQ_ANNOT
    with lock:
        STREAM_REQ_ANNOT = True
    return Response(gen_annotate(), mimetype="multipart/x-mixed-replace; boundary=frame")

def gen_annotate():
    global IMG_NORMAL_ANNOTATED, ANNOT_STREAM_UP, ANNOT_STREAM_CHECK, STREAM_REQ_ANNOT, lock
    while STREAM_REQ_ANNOT:
        with lock:
            if IMG_NORMAL_ANNOTATED is None or ANNOT_STREAM_CHECK == STREAM_REQ_ANNOT:
                continue
            (flag, encodedImage) = cv2.imencode(".jpg", IMG_NORMAL_ANNOTATED)
            if not flag:
                continue
            yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
            time.sleep(0.1)

def gen_normal():
    global IMG_NORMAL, NORM_STREAM_UP, NORM_STREAM_CHECK, STREAM_REQ_NORM, lock
    while STREAM_REQ_NORM:
        with lock:
            if IMG_NORMAL is None or NORM_STREAM_CHECK == NORM_STREAM_UP:
                continue
            (flag, encodedImage) = cv2.imencode(".jpg", IMG_NORMAL)
            if not flag:
                continue
            time.sleep(0.1)
            yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
            NORM_STREAM_UP = NORM_STREAM_CHECK

def gen_thermal():
    global IMG_THERMAL, THERM_STREAM_UP, THERM_STREAM_CHECK, STREAM_REQ_THERM, lock
    while STREAM_REQ_THERM:
        with lock:
            if IMG_THERMAL is None or THERM_STREAM_CHECK == THERM_STREAM_UP :
                continue
            (flag, encodedImage) = cv2.imencode(".jpg", IMG_THERMAL)
            if not flag:
                continue
            time.sleep(0.1)
            yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
            THERM_STREAM_UP = THERM_STREAM_CHECK

# NON STREAM ROUTS

@app.route("/normal")
def feed_normal_non_stream():
    global STREAM_REQ_NORM
    with lock:
        STREAM_REQ_NORM = True
    return Response(gen_normal_non_stream(), mimetype="image/jpeg; boundary=frame")
    with lock:
        STREAM_REQ_NORM = False

@app.route("/thermal")
def feed_thermal_non_stream():
    global STREAM_REQ_THERM
    with lock:
        STREAM_REQ_THERM = True
    return Response(gen_thermal_non_stream(), mimetype="image/jpeg; boundary=frame")  
    with lock:
        STREAM_REQ_THERM = False

@app.route("/annotate")
def feed_annotate_non_stream():
    global STREAM_REQ_ANNOT
    with lock:
        STREAM_REQ_ANNOT = True
    return Response(gen_annotate_non_stream(), mimetype="image/jpeg; boundary=frame")

def gen_annotate_non_stream():
    global IMG_NORMAL_ANNOTATED, ANNOT_STREAM_UP, ANNOT_STREAM_CHECK, STREAM_REQ_ANNOT, lock
    while STREAM_REQ_ANNOT:
        with lock:
            if IMG_NORMAL_ANNOTATED is None or ANNOT_STREAM_CHECK == STREAM_REQ_ANNOT:
                continue
            (flag, encodedImage) = cv2.imencode(".jpg", IMG_NORMAL_ANNOTATED)
            if not flag:
                continue
            return bytearray(encodedImage)

def gen_normal_non_stream():
    global IMG_NORMAL, NORM_STREAM_UP, NORM_STREAM_CHECK, STREAM_REQ_NORM, lock
    while STREAM_REQ_NORM:
        with lock:
            if IMG_NORMAL is None or NORM_STREAM_CHECK == NORM_STREAM_UP:
                continue
            (flag, encodedImage) = cv2.imencode(".jpg", IMG_NORMAL)
            if not flag:
                continue
            return bytearray(encodedImage)
            # return(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

def gen_thermal_non_stream():
    global IMG_THERMAL, THERM_STREAM_UP, THERM_STREAM_CHECK, STREAM_REQ_THERM, lock
    while STREAM_REQ_THERM:
        with lock:
            if IMG_THERMAL is None or THERM_STREAM_CHECK == THERM_STREAM_UP :
                continue
            (flag, encodedImage) = cv2.imencode(".jpg", IMG_THERMAL)
            if not flag:
                continue
            return bytearray(encodedImage)

def get_ip_address():
	"""Find the current IP address of the device"""
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("8.8.8.8", 80))
	ip_address=s.getsockname()[0]
	s.close()
	return ip_address

def conv_img(img):
    # rescale to big to ensure enough pixel data
    height, width = img.shape[:2]
    img = cv2.resize(img, (640, 480), interpolation = cv2.INTER_CUBIC)
    img = cv2.resize(img, (120, 120)) /255.
    return np.array(img).reshape(-1, 120, 120, 1)

def hasNoPendingHeatStressJob():
    global SYSTEM_STATE
    res = True
    for idx, job in enumerate(SYSTEM_STATE['jobs']):
        if job['caller'] == 'Heat Stress Detector':
            return False
    return res

def drawText(img, x, y, text, color, font, font_size):
    edited = cv2.putText(img, text, (x + 2, y + 2), font, font_size, (41, 30, 31), 2, cv2.LINE_AA)
    return cv2.putText(edited, text, (x, y), font, font_size, color, 2, cv2.LINE_AA)

def drawRect(img, start_point, end_point, color, thck):
    return cv2.rectangle(img, start_point, end_point, color, thck)

def getCenterPoint(x1,y1,x2,y2):
    center_x = math.floor(x1 + ((x2 - x1) / 2))
    center_y = math.floor(y1 + ((y2 - y1)/ 2))
    return center_x, center_y

def insideBound( bound, x, y ):
    insideXCoord = x >= bound['left_bound'] and x <= bound['right_bound']
    insideYCoord = y >= bound['top_bound'] and y <= bound['bottom_bound']
    return insideXCoord and insideYCoord

def getCellLocation(img_h, img_w, center_x, center_y):
    global GRID_COL, GRID_ROW, font
    bounds = []
    cell_w_size = int(img_w / GRID_COL)
    cell_h_size = int(img_h / GRID_ROW)
    computed_y_bound = cell_h_size
    cellCount = 1
    for i in range(GRID_ROW):
        top_bound = computed_y_bound - cell_h_size
        bot_bound = computed_y_bound

        computed_x_bound = cell_w_size
        for c in range(GRID_COL):
            left_bound = computed_x_bound - cell_w_size
            right_bound = computed_x_bound
            bounds.append({
                'left_bound' : left_bound,
                'top_bound' : top_bound,
                'right_bound' : right_bound,
                'bottom_bound' : bot_bound
            })
            computed_x_bound += cell_w_size
            cellCount += 1
        computed_y_bound += cell_h_size

    for idx, cell_bound in enumerate(bounds) :
        isInside = insideBound(cell_bound, center_x, center_y)
        if isInside: return idx + 1

    return -1

def detectHeatStress():
    global font, ANNOT_STREAM_CHECK, SYSTEM_STATE, DETECTION_MODE, TEMPERATURE_THRESHOLD, IMG_NORMAL_ANNOTATED, PHS_CNN, IMG_NORMAL, IMG_THERMAL, RAW_THERMAL, Yolov5_PHD, EXITING, LOGGER
    while not EXITING and Yolov5_PHD is not None and PHS_CNN is not None:
        loadDbConfig()
        if IMG_NORMAL is not None and IMG_THERMAL is not None:
            c_IMG_NORMAL = IMG_NORMAL
            c_IMG_THERMAL = IMG_THERMAL
            c_RAW_THERMAL = RAW_THERMAL
            c_Raw_Reshaped = np.reshape(c_RAW_THERMAL.copy(), (24,32))
            c_Raw_Reshaped = cv2.resize(c_Raw_Reshaped, (640, 480))
            c_Raw_Reshaped = cv2.flip(c_Raw_Reshaped, 1)
            
            H, W, C = c_IMG_NORMAL.shape

            curACTIONS = []

            to_read = c_IMG_NORMAL.copy()

            # DETECT IF SCENE IS DARK
            # CALL ALL ACTION THAT IS BIND TO DARK SCENE EVENT
            # TODO
            if SYSTEM_STATE['status'] != 2:
                Dark_Scene_Detector = isDarkScene(to_read) 
                if Dark_Scene_Detector  :
                    curACTIONS = activateCategory(curACTIONS, "Dark Scene Detector", True, 0)
            
            # FEEDING IMAGE FOR FINDING THE PIG LOCATION ON PICTURE USING YOLOV5s 
            #print("🟠 YoloV5 Detecting Pig 🐷")
            detect_pig_head = Yolov5_PHD(to_read) 
            #print("🟢 YoloV5 Detection Complete")
            #print("🗃  Returned Bbox", detect_pig_head)

            coords = detect_pig_head.pandas().xyxy[0].to_dict(orient="records")
        
            if len(coords) > 0:
                curt = datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")
                # print(f"LENGTH {len(coords)}: TIME {curt}")
                # detect_annotation = np.squeeze(detect_pig_head.render())
                detect_annotation = c_IMG_NORMAL

                img_normal_cropped = []
                img_thermal_cropped = []
                img_thermal_cropped_raw = []
                img_thermal_cropped_info = []

                mins = []
                avgs = []
                maxs = []

                detected = False
                
                pigC = 1
                for result in coords:
                    # if not hasNoPendingHeatStressJob():
                    #     break
                    x1 = int(result['xmin'])
                    y1 = int(result['ymin'])
                    x2 = int(result['xmax'])
                    y2 = int(result['ymax'])
                    conf = float(result['confidence'])

                    # skip if confidence level is less than 50%
                    detect_annotation = drawRect(detect_annotation, (x1,y1), (x2,y2), (26, 219, 27), 3)
                    detect_annotation = cv2.putText(detect_annotation, "%.2f %% %s" % (conf * 100, conf > .5 ? "sure" : "unsure"), (x1,y1), font, 1, (26, 219, 27), 2, cv2.LINE_AA)
                    if conf < 0.50 : continue
                    
                    detect_annotation = cv2.putText(detect_annotation, f'pig {pigC}', (x1,y1 + 20), font, 0.5, (100, 255, 50), 2, cv2.LINE_AA)
                    pigC += 1
                    #cv2.putText(detect_annotation, f'{x2} {y2}', (x2,y2), font, 0.5, (0, 255, 0), 2, cv2.LINE_AA)

                    # FOCUSED PIG LOCATION
                    center_x, center_y = getCenterPoint(x1,y1,x2,y2)
                    division_location = getCellLocation(H, W, center_x, center_y)

                    # CALL ALL ACTIONS FOR PIG DETECTOR 
                    # activate action regardless of pig location
                    curACTIONS = activateCategory(curACTIONS, "Pig Detector", True, division_location)
                    # activate action if matched pig location
                    curACTIONS = activateCategory(curACTIONS, "Pig Detector", False, division_location)

                    detect_annotation = cv2.circle(detect_annotation, (center_x, center_y ), 8 , (255, 220, 80), 2)
                    #cv2.putText(detect_annotation, f'{center_x} {center_y}', (center_x,center_y), font, 0.5, (0, 255, 0), 2, cv2.LINE_AA)

                    cpy_thrm_crop_raw = c_Raw_Reshaped[y1:y2, x1:x2]

                    # detection = CNN ( RAW THERMAL )
                    # converted_img = conv_img(cpy_thrm_crop_raw)

                    # DETECTION_MODE=False
                    # TEMPERATURE_THRESHOLD=0

                    classes =  ['Heat Stressed', 'Normal']

                    # constructing subinfo of the subcropped coords
                    cpy_thrm_crop = c_IMG_THERMAL[y1 : y2, x1 : x2]

                    min_temp = np.min(cpy_thrm_crop_raw)
                    avg_temp = np.mean(cpy_thrm_crop_raw)
                    max_temp = np.max(cpy_thrm_crop_raw)

                    chosenColor = (59, 235, 255)

                    if max_temp == 0 : break

                    detect_annotation = drawText(detect_annotation, x1, y2 - 10,  "%.1f C" % (max_temp), chosenColor, font, 0.5)

                    if(DETECTION_MODE):
                        # keras_img = converted_img
                        keras_img = cpy_thrm_crop_raw
                        keras_img = cv2.resize(keras_img, (128, 128))
                        img_tensor = tf.keras.preprocessing.image.img_to_array(keras_img)
                        img_tensor /= 255. 

                        res = PHS_CNN.predict(np.array(img_tensor).reshape(-1, 128, 128, 1))
                        classification = classes[round(float(np.squeeze(res)))]
                        
                        # TODO # NOTE Remove 'np.max <=39.0' On Final Training of PHS Detector
                        if classification == classes[1]:
                            #img, x, y, text, color, font, font_size
                            detect_annotation = drawText(detect_annotation, x1, y1 + 20, 'Normal', chosenColor, font, 0.6)
                            continue
                    else:
                        if max_temp < TEMPERATURE_THRESHOLD:
                            detect_annotation = drawText(detect_annotation, x1, y1 + 20, 'Normal', chosenColor, font, 0.6)
                            continue

                    chosenColor = (140, 94, 255)
                    detect_annotation = drawText(detect_annotation, x1, y1 + 20, 'HeatStress', chosenColor, font, 0.6)
                    detected = True

                    # If it does classified stressed then set as detected to true
                    # also call the action bind to HEAT STRESS DETECTOR  

                    if SYSTEM_STATE['status'] != 2:
                        if hasNoPendingHeatStressJob():
                            # Call all action that require location match
                            curACTIONS = activateCategory(curACTIONS, "Heat Stress Detector", False, division_location)
                            # Call all action that doesn't require location match
                            curACTIONS = activateCategory(curACTIONS, "Heat Stress Detector", True, division_location)
                            # break

                    LOGGER.info(f'Detected 🔥 Heat Stress on pig {pigC}')
                    cpy_crop_normal = c_IMG_NORMAL[y1 : y2, x1 : x2]

                    img_thermal_cropped_raw.append(cpy_thrm_crop_raw)
                    img_normal_cropped.append(cpy_crop_normal)
                    img_thermal_cropped.append(cpy_thrm_crop)

                    infoObj = { 'min_temp' : min_temp, 'avg_temp' : avg_temp, 'max_temp' : max_temp }
                    img_thermal_cropped_info.append(infoObj)
                    mins.append(min_temp)
                    avgs.append(avg_temp)
                    maxs.append(max_temp)

                curt = datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")

                if detected and True:
                    overal_min_temp = sum(mins) / len(mins)
                    overal_avg_temp = sum(avgs) / len(avgs)
                    overal_max_temp = sum(maxs) / len(maxs)
                    
                    #call save function XD to save the heat stress event
                    if SYSTEM_STATE['status'] != 2 :
                        saveDetection(c_IMG_NORMAL, c_IMG_THERMAL, c_RAW_THERMAL, detect_annotation, curt, img_normal_cropped, img_thermal_cropped, img_thermal_cropped_raw, len(coords), img_thermal_cropped_info, overal_min_temp, overal_avg_temp, overal_max_temp, curACTIONS)
                    with lock:
                        if SYSTEM_STATE['status'] != -1 :
                            SYSTEM_STATE['status'] = 1
                            print("Update State @ detectheatstress()")
                with lock:
                    IMG_NORMAL_ANNOTATED = detect_annotation
                    ANNOT_STREAM_CHECK = ANNOT_STREAM_CHECK + 1
                    SYSTEM_STATE['pig_count'] = len(coords)
            else:
                with lock:
                    SYSTEM_STATE['pig_count'] = 0
        else:
            time.sleep(4.5)

@app.route("/testFunc", methods=['GET', 'POST'])
def testFunc():
    global LOGGER
    LOGGER.info("Test Function Route Called")
    return {"message" : "ok"}, 200

def saveDetection(normal, thermal, raw_thermal, normal_annotated, stmp, croped_normal, croped_thermal, croped_thermal_raw, total_pig, sub_info, o_min_temp, o_avg_temp, o_max_temp, Actions_did):
    global CANSAVE, LOGGER

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
                "min_temp" : o_min_temp,
                "avg_temp" : o_avg_temp,
                "max_temp" : o_max_temp,
                "pig_count": total_pig,
                "stressed_pig": len(croped_normal),
                "breakdown": [],
            },
            "actions": Actions_did,
            "cat" : datetime.today(),
            "uat" : datetime.today(),
            "dat" : None
        }

        x = 1

        LOGGER.info(f"💾 Writing {len(croped_normal)} Sub Detect Pig Data : ")
        for i in range(len(croped_normal)):
            if CANSAVE:
                cv2.imwrite(f"{path2}/pig-{x}.png", croped_normal[i])
                cv2.imwrite(f"{path2}/pig-thermal-processed{x}.png", croped_thermal[i])
                cv2.imwrite(f"{path2}/pig-thermal-unprocessed{x}.png", croped_thermal_raw[i])
            
            rdata = croped_thermal_raw[i]
            rdata = cv2.resize(rdata, (32,24))

            DATA_DICT['data']['breakdown'].append(
                {
                    "normal_thumb": f"{server_path}/Target/pig-{x}.png",
                    "thermal_thumb": f"{server_path}/Target/pig-thermal-processed{x}.png",
                    "thermal_raw_thumb": f"{server_path}/Target/pig-thermal-unprocessed{x}.png",
                    "info" : sub_info[i],
                    "raw" : rdata.tolist()
                }
            )

            x+=1

        LOGGER.info("💾 Writing Master Images")
        if CANSAVE:
            cv2.imwrite(f"{path1}/img_normal.png", normal)
            cv2.imwrite(f"{path1}/img_annotated.png", normal_annotated)
            cv2.imwrite(f"{path1}/img_thermal.png", thermal)
        else:
            LOGGER.info("Can't Save Because system can't write anymore than 95% storage")
            errorWrite({
                "_id" : f'{datetime.now()}-LOCAL',
                "notification_type" : "error",
                "title": "Storage exceed 95%",
                "message": "PHS will not be able to save more data on storage, please free up space or read more info about the error code on the manual.",
                "additional": {
                    "error_code": 3,
                    "severity": "medium",
                    "error_log": "Can't write more data, storage usage exceeds 95%"
                },
                "priority": 0,
                "links" : [
                    {
                        "link" : "http://localhost:3001/",
                        "link_mode" : False,
                        "link_short" : "/",
                    }
                ],
                "seenBy" : [],
                "date" : f'{datetime.now()}',
            })

        detection_insert = DB_DETECTIONS.insert_one( DATA_DICT )

        # if CANSAVE:
            # p = pickle.dump( raw_thermal, open(f'../phsmachine_web/public/detection/Detection-{stmp}/raw_thermal.pkl', 'wb'))
        LOGGER.info("✅ Done Saving Event Data 👌")

        DetectionNotification = dict({
            "notification_type" : "detection",
            "title" : "Heat Stress Detected",
            "message" : f" {len(croped_normal)} Pig(s) stressed. Detection record ID is {detection_insert.inserted_id}, you can view more info about this detection on the link below. The system will use the defined actions for heat stress event to releave pig temperature",
            "priority": 0,
            "links" : [
                    {
                        "link" : f"/detection_details?_id={detection_insert.inserted_id}",
                        "link_short": f"/detection_details?_id={detection_insert.inserted_id}",
                        "link_mode": True 
                    }],
            "seenBy" : [],
            "date" : datetime.today()
            })

        DB_NOTIFICATION.insert_one(DetectionNotification)
        
        try:
            emailContent =  {
                "type" : 1,
                "template_content": {
                    "heat_stress_count" : len(croped_normal),
                    "action_count" : len(Actions_did),
                    "detection_id" : f"{detection_insert.inserted_id}"
                }
            }
            x = requests.post('http://localhost:3000/api/sendMail', json=emailContent)
        except Exception as e:
            LOGGER.error(f"Can't send email, NextJs or Internet maybe down | {str(e)}")

    except Exception as e: LOGGER.error(f"🚩 Can't Save : {str(e)}")

def doesActionNameAlreadyActive(action_name) : 
    global SYSTEM_STATE, R_CONTROLLER, ACTION_STATE
    for idx, job in enumerate(SYSTEM_STATE['jobs']):
        f_action_name = job['action_name']
        if f_action_name == action_name:
            return True
    return False

def activateCategory(old_activate, caller, ForceActivate, Location):
    global ACTION_STATE, SYSTEM_STATE, LOGGER
    
    if SYSTEM_STATE['status'] == 2 or SYSTEM_STATE['status'] == -1:
        return

    actions = list(DB_CONFIGS.find({ "category" : "actions", "disabled" : False }))
    new_activated = []
    
    for action in actions:
        eventLocation = action['value']['eventLocation']
        forceActivate = action['value']['forceActivate']
        act_caller = action['value']['caller']
        targets = action['value']['targets']
        action_name = action['config_name']

        if ForceActivate and forceActivate or act_caller == 'Dark Scene Detector':
            if act_caller == caller:
                if not doesActionNameAlreadyActive(action_name):
                    activated = activateJob(targets, action_name, caller)
                    ACTION_STATE.toggle(action_name, True)
                    new_activated.append(activated)
                    LOGGER.info(f'Activated {action_name} - Force Activate')
            continue

        if act_caller == caller and eventLocation == Location:
            if not doesActionNameAlreadyActive(action_name):
                activated = activateJob(targets, action_name, caller)
                ACTION_STATE.toggle(action_name, True)
                new_activated.append(activated)
                LOGGER.info(f'Activated {action_name} - Location Based {Location}')
                
    if old_activate is None : return new_activated
    return old_activate + new_activated

def activateJob(targets, action_name, caller):
    global SYSTEM_STATE
    newJobs = []
    sortedTarg = sorted(targets, key=lambda d: d['duration']) 
    for targs in sortedTarg : 
            
            duration = targs['duration']
            endTime = datetime.now() + timedelta(seconds=int(duration))
            targRelay = targs['target_relay']
            newJob = { 
                "action_name" : action_name, 
                "relay_name" : f'{targRelay}', 
                "caller" : caller, 
                "duration" : duration, 
                "end" : endTime }
            if SYSTEM_STATE['status'] == 2: return newJob
            SYSTEM_STATE['jobs'].append(newJob)
            newJobs.append(newJob)
    return newJobs  

def updateJobs():
    global SYSTEM_STATE, R_CONTROLLER, ACTION_STATE, EXITING
    hasPrev = False
    
    while not EXITING:
        time.sleep(0.2)
        S_STATE = SYSTEM_STATE['status']
        if S_STATE == 2:
            ACTION_STATE.offAll()
            continue
        if EMERGENCY_STOP or S_STATE == -1:
            SYSTEM_STATE['jobs'] = []
            R_CONTROLLER.offAll()
            ACTION_STATE.offAll()
        
        heatStressResolveJobs = 0

        for idx, job in enumerate(SYSTEM_STATE['jobs']):
            endTime = job['end']
            curTime = datetime.now()

            elapsed = int((endTime - curTime).total_seconds())
            
            if job['caller'] == 'Heat Stress Detector':
                heatStressResolveJobs += 1

            if curTime >= endTime:
                R_CONTROLLER.toggleRelay(job['relay_name'],False)
                SYSTEM_STATE['jobs'].pop(idx)
                ACTION_STATE.toggle(job['action_name'], False)
                ACTION_STATE.setElapsed(job['action_name'], elapsed)
            else:
                R_CONTROLLER.toggleRelay(job['relay_name'],True)
                ACTION_STATE.toggle(job['action_name'], True)
                ACTION_STATE.setElapsed(job['action_name'], elapsed)
                hasPrev = True
        if heatStressResolveJobs <= 0:
            curSysStatus = SYSTEM_STATE['status']
            
            if curSysStatus != 2 or curSysStatus != -1 or curSysStatus != -2 :
                SYSTEM_STATE['status'] = 0
                # print("Update State @ JOBS")

def isDarkScene(image):
    global LOGGER
    dim=20
    thresh=0.3

    image = cv2.resize(image, (dim, dim))
    L, A, B = cv2.split(cv2.cvtColor(image, cv2.COLOR_BGR2LAB))
    L = L/np.max(L)
    res = np.mean(L) < thresh
    if res:
        LOGGER.warning(f"📹 Camera see's dark. {np.mean(L)}")

    return res

def readCams():
    global IMG_NORMAL, CAM_THERMAL, CAM_NORMAL, IMG_THERMAL, RAW_THERMAL, SYSTEM_STATE, THERM_STREAM_CHECK, NORM_STREAM_CHECK, EXITING, LOGGER

    while CAM_THERMAL is not None and not EXITING:
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
            LOGGER.error(f"Camera error or Thermal cam error | This can be ignored as it normally occurs -> Too many retries....")
        if current_frame is not None and thermal_frame is not None:
            with lock:
                IMG_NORMAL = current_frame.copy()
                IMG_THERMAL = thermal_frame.copy()
                RAW_THERMAL = raw_thermal.copy()
                if THERM_STREAM_CHECK > 100 or NORM_STREAM_CHECK > 100 :
                    THERM_STREAM_CHECK = 0
                    NORM_STREAM_CHECK = 1
                else:
                    THERM_STREAM_CHECK = THERM_STREAM_CHECK + 1
                    NORM_STREAM_CHECK = NORM_STREAM_CHECK + 1                

def loadDbConfig():
    global R_CONTROLLER, SYSTEM_STATE, ACTION_STATE, UPDATE_STAMP, DETECTION_MODE, TEMPERATURE_THRESHOLD, GRID_COL, GRID_ROW, AUTODELETE, WEIGHTS_DIR, PHS_CNN_DIR, CANSAVE, _SELFPATH_, _SELF_IP
    try:
        relays = list(DB_CONFIGS.find({ "category" : "relays" }))
        actions = list(DB_CONFIGS.find({ "category" : "actions", "disabled" : False }))
        updateStamp = DB_CONFIGS.find_one({"category" : "update", "config_name" : "update_stamp"})

        detectionMode = DB_CONFIGS.find_one({"category" : "config", "config_name" : "DetectionMode"})
        phs_grid_divisions = DB_CONFIGS.find_one({"category" : "config", "config_name" : "divisions"})
        phs_autodelete = DB_CONFIGS.find_one({"category" : "config", "config_name" : "storageAutoDelete"})

        phs_identity = DB_CONFIGS.find_one({"category" : "config", "config_name" : "identity"})
        
        newUpdateStamp = updateStamp['value'] 
        hasNewUpdateStamp = False

        if UPDATE_STAMP is None or UPDATE_STAMP != newUpdateStamp:
            hasNewUpdateStamp = True
            with lock:
                UPDATE_STAMP = newUpdateStamp
            
        if hasNewUpdateStamp :
            with lock:
                GRID_COL = phs_grid_divisions['value']['col']
                GRID_ROW = phs_grid_divisions['value']['row']
                AUTODELETE = phs_autodelete['value']
                WEIGHTS_DIR = os.path.join(_SELFPATH_, phs_identity['value']['Yolo_Weights']['path'])
                PHS_CNN_DIR = os.path.join(_SELFPATH_, phs_identity['value']['Heat_Stress_Weights']['path'])

        if hasNewUpdateStamp :
            with lock:
                DETECTION_MODE = detectionMode['value']['mode']
                TEMPERATURE_THRESHOLD = float(detectionMode['value']['temperatureThreshold'])
    
        if R_CONTROLLER is not None:
            if (len(R_CONTROLLER.getAllRelays()) != len(relays) or hasNewUpdateStamp):
                R_CONTROLLER.delRelays(relays)      
        else:
            R_CONTROLLER = r_controller(relays, True, True)

        if len(ACTION_STATE.actions) != len(actions):
            ACTION_STATE = a_controller(actions, ACTION_STATE.actions)
        deleteErrorCode(2)
    except Exception as e:
        LOGGER.error(f"Error Loading ConfigDb -> {str(e)}")
        errorWrite({
            "_id" : f'{datetime.now()}-LOCAL',
            "notification_type" : "error",
            "title": "PHS Core Database Server Timeout",
            "message": "PHS will not be able to function without the configurations inside the database. Restart PHS to possibly start the database, or read more info about the error code on the manual",
            "additional": {
                "error_code": 2,
                "severity": "high",
                "error_log": ("Error : {0}".format(str(e)))
            },
            "priority": 0,
            "links" : [
                {
                        "link" : "http://localhost:3001/",
                        "link_mode" : False,
                        "link_short" : "/",
                    }
            ],
            "seenBy" : [],
            "date" : f'{datetime.now()}',
        })

    try:
        with lock:
            phs_identity_next = requests.get(f'http://{_SELF_IP}:3000/api/connectivity')
            phs_identity_next = phs_identity_next.json()
            CANSAVE = phs_identity_next['storage']['canSave']
    except Exception as e: print('',end='')
        # LOGGER.error(f"Error NextJs Server -> {str(e)}")

    try:
        if AUTODELETE and not CANSAVE : x = requests.post("http://localhost:3000/api/autoDelete")
    except Exception as e: print('',end='')
        # LOGGER.error(f"Error NextJs Server Autodelete -> {str(e)}")

def process(raw):
    try:
        raw.shape = (24,32)
        raw = cv2.flip(raw,1)
        return raw
    except Exception as e: print("🚩 Can't Processs this raw thermal",e)

def safe_exit(signum, frame):
    exit(1)

def printLcd(content, row):
    global _LCD, _SELF_IP
    try:
        _LCD.text(f"3000", 2)
        _LCD.text(content, row)
    except Exception as e:
        print(e)
        LOGGER.error('Can\'t print to LCD ', e)

def statusToString ( status ):
    if status == -1 : return 'Disabled'
    statuses = ['Detecting', 'Resolving', 'Debugging', 'Connecting']
    return statuses[status]

def start_server():
    global _LCD, _SELF_IP, Yolov5_PHD, PHS_CNN, YOLO_DIR, WEIGHTS_DIR ,ACTION_STATE, CAM_THERMAL, CAM_NORMAL, RAW_THERMAL, SYSTEM_STATE, R_CONTROLLER, IMG_NORMAL_ANNOTATED, IMG_NORMAL, IMG_THERMAL, WEIGHTS_DIR, PHS_CNN_DIR, LOGGER
    updateLoggerHandler()
    LOGGER.info('⏳ Starting PHS')

   
    
    CAM_NORMAL = Cam_Norm()
    time.sleep(1)
    CAM_THERMAL = cam_therm()
    time.sleep(5)
    ACTION_STATE = a_controller((),())

    IMG_NORMAL_ANNOTATED = cv2.imread('misc/annotation_init.jpg')

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
    
    LOGGER.info('⏳ Pulling Configs From DB')
    loadDbConfig()
    LOGGER.info('Done Pulling Config')
    RAW_THERMAL = np.zeros((24*32,))        

    try:
        LOGGER.info(f"⏳ Loading Yolo V5 -> {WEIGHTS_DIR}")
        Yolov5_PHD = torch.hub.load(
                YOLO_DIR,
                'custom',
                path=WEIGHTS_DIR, 
                source='local',
                device = 'cpu',
                force_reload=True
            )
        LOGGER.info("Done loading yolo")
        deleteErrorCode(4)
    except Exception as e:
        errorWrite({
        "_id" : f'{datetime.now()}-LOCAL',
        "notification_type" : "error",
        "title": "PHS Core Yolo AI failed to load",
        "message": "PHS will not identify pig because the Yolo model was not loaded successfully, PHS will not be able to detect pig. Please check the manual for fix.",
        "additional": {
            "error_code": 4,
            "severity": "high",
            "error_log": ("Error : {0}".format(str(e))),
        },
        "priority": 0,
        "links" : [
            {
                        "link" : "http://localhost:3001/",
                        "link_mode" : False,
                        "link_short" : "/",
                    }
        ],
        "seenBy" : [],
        "date" : f'{datetime.now()}',
        })
        LOGGER.error(f"ERROR LOADING PHS YOLO V5 : {str(e)}")

    LOGGER.info(f"Loading PHS Heat Stress CNN -> {PHS_CNN_DIR}")
    try:
        PHS_CNN = tf.keras.models.load_model(PHS_CNN_DIR)
        LOGGER.info("Loaded PHS Heat Stress CNN!")

        deleteErrorCode(5)
    except Exception as e:
        errorWrite({
        "_id" : f'{datetime.now()}-LOCAL',
        "notification_type" : "error",
        "title": "PHS Core Yolo AI failed to load",
        "message": "PHS will not identify pig because the Yolo model was not loaded successfully, PHS will not be able to detect pig. Please check the manual for fix.",
        "additional": {
            "error_code": 5,
            "severity": "high",
            "error_log": ("Error : {0}".format(str(e))),
        },
        "priority": 0,
        "links" : [
            {
                        "link" : "http://localhost:3001/",
                        "link_mode" : False,
                        "link_short" : "/",
                    }
        ],
        "seenBy" : [],
        "date" : f'{datetime.now()}',
        })
        LOGGER.error(f"ERROR LOADING PHS Heat Stress CNN : {str(e)} ")

    camThread = threading.Thread(target=readCams)
    camThread.daemon = True
    camThread.start()
    LOGGER.info("Init Thread Read Cameras")

    detectThread = threading.Thread(target=detectHeatStress)
    detectThread.daemon = True
    detectThread.start()
    LOGGER.info("Init Thread Heat Stress Detection")


    jobsThread = threading.Thread(target=updateJobs)
    jobsThread.daemon = True
    jobsThread.start()
    LOGGER.info("Init Jobs Thread")


    ip=get_ip_address()
    port=8000
    _SELF_IP = f'{ip}'

    print(f'📍 Server can be found at http://{ip}:{port} or http://localhost:{port}')
    LOGGER.info(f'📍 Server can be found at http://{ip}:{port} or http://localhost:{port}')
    
    try:
        _LCD = LCD()
        signal(SIGTERM, safe_exit)
        signal(SIGHUP, safe_exit)
        _LCD.text(f"{_SELF_IP}", 1)
        _LCD.text(f"3000",2)
    except Exception as e:
        LOGGER.error("SIGTERM, SIGHUP err")

    log = logging.getLogger('werkzeug')
    log.disabled = True
    app.run(host=ip, port=port, debug=False, threaded=True, use_reloader=False)

@atexit.register
def goodbye():
    global _LCD, R_CONTROLLER, EXITING
    with lock:
        EXITING = True
    print("\n")
    LOGGER.info(f"⏾ PHS Turning OFF")
    _LCD.text("PHS Turned Off", 1)
    _LCD.text("Good Bye...", 2)
    time.sleep(1)
    _LCD.clear()
    if R_CONTROLLER is not None:
        R_CONTROLLER.offAll()
    LOGGER.info(f"💤 Good Bye ....")
if __name__ == '__main__':
	start_server()
