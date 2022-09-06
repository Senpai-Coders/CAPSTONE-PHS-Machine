from datetime import datetime, timedelta 
import time
from flask import Response, request
from flask import Flask
import threading
import time, socket
import cv2
import logging
import math

from cameras.cam_normal import Cam_Norm
from cameras.cam_thermal import cam_therm

from cameras.cam_normal import Cam_Norm

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

font = cv2.FONT_HERSHEY_SIMPLEX

YOLO_DIR = os.path.join('models','Yolov5')
WEIGHTS_DIR = os.path.join('best.pt')

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

# For PHS Area Tracking & Action Location
GRID_COL=1
GRID_ROW=1

Yolov5_PHD=None
PHS_CNN=None

MONGO_CONNECTION=None

MONGO_CONNECTION=pymongo.MongoClient("mongodb://localhost:27017")

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

@app.route("/emergencyStop")
def setEmergencyStop():
    global EMERGENCY_STOP, SYSTEM_STATE
    with lock:
        EMERGENCY_STOP = True
        SYSTEM_STATE['status'] = -1
    response = Response(mongoResToJson({ "message" : "ok" }), content_type='application/json')
    return response, 200

@app.route("/getActionState")
def getActiGonState():
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
    global SYSTEM_STATE, R_CONTROLLER, ACTION_STATE, EMERGENCY_STOP, lock
    # -2 Off
    # -1 Disabled
    # 0 Detecting
    # 1 Resolving
    # 2 Debugging
    # 3 Connecting
    status = request.args.get('status')
    with lock:
            if(int(status) == 2 or int(status == -1)):
                SYSTEM_STATE['jobs'] = []
                R_CONTROLLER.offAll()
                ACTION_STATE.offAll()
            elif int(status) == 0:
                R_CONTROLLER.offAll()
                EMERGENCY_STOP = False
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
    global STREAM_REQ_NORM
    print('req normal feed') 
    with lock:
        STREAM_REQ_NORM = True
    return Response(gen_normal(), mimetype="multipart/x-mixed-replace; boundary=frame")
    with lock:
        print("client normal feed disconnected")
        STREAM_REQ_NORM = False

@app.route("/thermal_feed")
def feed_thermal():
    global STREAM_REQ_THERM
    print('req thermal feed') 
    with lock:
        STREAM_REQ_THERM = True
    return Response(gen_thermal(), mimetype="multipart/x-mixed-replace; boundary=frame")  
    with lock:
        print("client thermal feed disconnected")
        STREAM_REQ_THERM = False

@app.route("/annotate_feed")
def feed_annotate():
    global STREAM_REQ_ANNOT
    print('req annotation feed') 
    with lock:
        STREAM_REQ_ANNOT = True
    return Response(gen_annotate(), mimetype="multipart/x-mixed-replace; boundary=frame")

# This is for testing only to test if activate action is working
@app.route("/DummyActivateCategory", methods=['POST'])
def fakeActivate():
    global ACTION_STATE
    ReqBod = request.get_json(force=True)
    callerName = ReqBod['caller']
    activateCategory([ ], callerName)

    return "ok",200

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
    global font, ANNOT_STREAM_CHECK, DETECTION_MODE, TEMPERATURE_THRESHOLD, IMG_NORMAL_ANNOTATED, PHS_CNN, IMG_NORMAL, IMG_THERMAL, RAW_THERMAL, Yolov5_PHD, EXITING
    while not EXITING:
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
            Dark_Scene_Detector = isDarkScene(to_read) 
            if Dark_Scene_Detector:
                curACTIONS = activateCategory(curACTIONS, "Dark Scene Detector", True, 0)
            
            # FEEDING IMAGE FOR FINDING THE PIG LOCATION ON PICTURE USING YOLOV5s 
            #print("🟠 YoloV5 Detecting Pig 🐷")
            detect_pig_head = Yolov5_PHD(to_read) 
            #print("🟢 YoloV5 Detection Complete")
            #print("🗃  Returned Bbox", detect_pig_head)

            coords = detect_pig_head.pandas().xyxy[0].to_dict(orient="records")
        
            if len(coords) > 0:
                detect_annotation = np.squeeze(detect_pig_head.render())
                
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
                    if not hasNoPendingHeatStressJob():
                        break

                    #print(result)
                    #confidence = float(result['confidence'])
                    #if confidence < 75.0: break
                    x1 = int(result['xmin'])
                    y1 = int(result['ymin'])
                    x2 = int(result['xmax'])
                    y2 = int(result['ymax'])
                    print(f'🐷 PIG {pigC}')
                    detect_annotation = cv2.putText(detect_annotation, f'pig {pigC}', (x1,y1 + 20), font, 0.5, (100, 255, 50), 2, cv2.LINE_AA)
                    pigC += 1
                    #cv2.putText(detect_annotation, f'{x2} {y2}', (x2,y2), font, 0.5, (0, 255, 0), 2, cv2.LINE_AA)

                    #print('h:',H, 'w:', W)
                    #print(x1, y1, x2, y2, x1 + x2, y1 + y2)

                    # FOCUSED PIG LOCATION
                    center_x, center_y = getCenterPoint(x1,y1,x2,y2)
                    division_location = getCellLocation(H, W, center_x, center_y)

                    print('Pig Location',division_location)

                    # CALL ALL ACTIONS FOR PIG DETECTOR 
                    # activate action regardless of pig location
                    curACTIONS = activateCategory(curACTIONS, "Pig Detector", True, division_location)
                    # activate action if matched pig location
                    curACTIONS = activateCategory(curACTIONS, "Pig Detector", False, division_location)
                    #print(f"🐖 PHS Detect detected {len(coords)} pigs")

                    detect_annotation = cv2.circle(detect_annotation, (center_x, center_y ), 4 , (255, 220, 80), 2)
                    #cv2.putText(detect_annotation, f'{center_x} {center_y}', (center_x,center_y), font, 0.5, (0, 255, 0), 2, cv2.LINE_AA)

                    #print('🐷 pig at coord :',x1,y1,x2,y2 )
                    cpy_thrm_crop_raw = c_Raw_Reshaped[y1:y2, x1:x2]

                    # detection = CNN ( RAW THERMAL )
                    converted_img = conv_img(cpy_thrm_crop_raw)

                    # DETECTION_MODE=False
                    # TEMPERATURE_THRESHOLD=0

                    classes =  ['Heat Stressed', 'Normal']

                    # constructing subinfo of the subcropped coords
                    cpy_thrm_crop = c_IMG_THERMAL[y1 : y2, x1 : x2]
                    min_temp = np.min(cpy_thrm_crop_raw)
                    avg_temp = np.mean(cpy_thrm_crop_raw)
                    max_temp = np.max(cpy_thrm_crop_raw)

                    chosenColor = (59, 235, 255)

                    detect_annotation = drawText(detect_annotation, x1, y2 - 10,  "%.2f C" % (max_temp), chosenColor, font, 0.5)

                    if(DETECTION_MODE):
                        identify_pig_stress = PHS_CNN.predict(converted_img)
                        classification = classes[np.argmax(identify_pig_stress)]
                        print('AI - Classified as ', classification)
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

                    # Call all action that require location match
                    curACTIONS = activateCategory(curACTIONS, "Heat Stress Detector", False, division_location)

                    # Call all action that doesn't require location match
                    curACTIONS = activateCategory(curACTIONS, "Heat Stress Detector", True, division_location)

                    print("Detected 🔥 Heat Stress on pig")
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
                    saveDetection(c_IMG_NORMAL, c_IMG_THERMAL, c_RAW_THERMAL, detect_annotation, curt, img_normal_cropped, img_thermal_cropped, img_thermal_cropped_raw, len(coords), img_thermal_cropped_info, overal_min_temp, overal_avg_temp, overal_max_temp, curACTIONS)
                    with lock:
                        SYSTEM_STATE['status'] = 1
                with lock:
                    IMG_NORMAL_ANNOTATED = detect_annotation
                    ANNOT_STREAM_CHECK = ANNOT_STREAM_CHECK + 1
                    SYSTEM_STATE['pig_count'] = len(coords)
            else:
                with lock:
                    SYSTEM_STATE['pig_count'] = 0
        else:
            time.sleep(4.5)

def saveDetection(normal, thermal, raw_thermal, normal_annotated, stmp, croped_normal, croped_thermal, croped_thermal_raw, total_pig, sub_info, o_min_temp, o_avg_temp, o_max_temp, Actions_did):
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

        print(f"💾 Writing {len(croped_normal)} Sub Detect Pig Data : ", end='')
        for i in range(len(croped_normal)):
            print(".", end='')
            cv2.imwrite(f"{path2}/pig-{x}.png", croped_normal[i])
            cv2.imwrite(f"{path2}/pig-thermal-processed{x}.png", croped_thermal[i])
            cv2.imwrite(f"{path2}/pig-thermal-unprocessed{x}.png", croped_thermal_raw[i])
            
            rdata = croped_thermal_raw[i]
            rdata = cv2.resize(rdata, (24,32))

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

        print("💾 Writing Master Images")
        cv2.imwrite(f"{path1}/img_normal.png", normal)
        cv2.imwrite(f"{path1}/img_annotated.png", normal_annotated)
        cv2.imwrite(f"{path1}/img_thermal.png", thermal)

        detection_insert = DB_DETECTIONS.insert_one( DATA_DICT )

        p = pickle.dump( raw_thermal, open(f'../phsmachine_web/public/detection/Detection-{stmp}/raw_thermal.pkl', 'wb'))
        print("✅ Done Saving Event Data 👌")

        DetectionNotification = dict({
            "notification_type" : "detection",
            "title" : "Heat Stress Detected",
            "message" : f" {len(croped_normal)} Pig(s) stressed. Detection record ID is {detection_insert.inserted_id}, you can view more info about this detection on the link below. The system will use the defined actions for heat stress event to releave pig temperature",
            "priority": 0,
            "links" : [
                    {
                    "link" : "","link_short": f"/detection_details?_id={detection_insert.inserted_id}",
                    "link_mode": True 
                    }],
            "seenBy" : [],
            "date" : datetime.today()
            })
        
        print("TYPE", type(DetectionNotification))

        DB_NOTIFICATION.insert_one(DetectionNotification)
        print("✅ Done Creating Notification 👌")

    except Exception as e: print("🚩 Can't Save : err 👉 ",e)

def doesActionNameAlreadyActive(action_name) : 
    global SYSTEM_STATE, R_CONTROLLER, ACTION_STATE
    for idx, job in enumerate(SYSTEM_STATE['jobs']):
        f_action_name = job['action_name']
        if f_action_name == action_name:
            return True
    return False

def activateCategory(old_activate, caller, ForceActivate, Location):
    global ACTION_STATE, SYSTEM_STATE

    if SYSTEM_STATE['status'] == 2:
        return

    actions = list(DB_CONFIGS.find({ "category" : "actions", "disabled" : False }))
    new_activated = []
    
    for action in actions:
        eventLocation = action['value']['eventLocation']
        forceActivate = action['value']['forceActivate']
        act_caller = action['value']['caller']
        targets = action['value']['targets']
        action_name = action['config_name']


        if ForceActivate and forceActivate:
            if act_caller == caller:
                if not doesActionNameAlreadyActive(action_name):
                    activated = activateJob(targets, action_name, caller)
                    ACTION_STATE.toggle(action_name, True)
                    new_activated.append(activated)
                    print(f'Activated {action_name} - Force Activate')
            continue

        if act_caller == caller and eventLocation == Location:
            if not doesActionNameAlreadyActive(action_name):
                activated = activateJob(targets, action_name, caller)
                ACTION_STATE.toggle(action_name, True)
                new_activated.append(activated)
                print(f'Activated {action_name} - Location Based {Location}')



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
     
    while not EXITING:
        time.sleep(0.2)
        S_STATE = SYSTEM_STATE['status']
        if EMERGENCY_STOP or S_STATE == 2 or S_STATE == -1:
            SYSTEM_STATE['jobs'] = []
            R_CONTROLLER.offAll()
            ACTION_STATE.offAll()
        
        # print(f"*********** 🔼 PHS ACTIONS HAS {len(SYSTEM_STATE['jobs'])} JOBS 🔼 *****************\n")

        heatStressResolveJobs = 0

        for idx, job in enumerate(SYSTEM_STATE['jobs']):
            endTime = job['end']
            curTime = datetime.now()

            elapsed = int((endTime - curTime).total_seconds())
            
            if job['caller'] == 'Heat Stress Detector':
                heatStressResolveJobs += 1

            if curTime >= endTime:
                #print('PHS JOB 🔶 : ✅ ACTION ENDED :', end='')
                R_CONTROLLER.toggleRelay(job['relay_name'],False)
                SYSTEM_STATE['jobs'].pop(idx)
                ACTION_STATE.toggle(job['action_name'], False)
                ACTION_STATE.setElapsed(job['action_name'], elapsed)
            else:
                #print('PHS JOB 🔶 : ⚡ ACTIVE ACTION/JOB ', end='')
                R_CONTROLLER.toggleRelay(job['relay_name'],True)
                ACTION_STATE.toggle(job['action_name'], True)
                ACTION_STATE.setElapsed(job['action_name'], elapsed)
        if heatStressResolveJobs <= 0:
            curSysStatus = SYSTEM_STATE['status']
            if curSysStatus not in [ -1, -2, 2 ]:
                SYSTEM_STATE['status'] = 0

def isDarkScene(image):
    dim=20
    thresh=0.3

    image = cv2.resize(image, (dim, dim))
    L, A, B = cv2.split(cv2.cvtColor(image, cv2.COLOR_BGR2LAB))
    L = L/np.max(L)
    res = np.mean(L) < thresh
    if res:
        print(f"📹 Camera Seems seing very 🌃 dark scene.{np.mean(L)} gastug di ako makakita 😣")
    else:
        print(f"📹 Camera seems seing👀 fine.{np.mean(L)}")
    return res

def readCams():
    global IMG_NORMAL, CAM_THERMAL, CAM_NORMAL, IMG_THERMAL, RAW_THERMAL, SYSTEM_STATE, THERM_STREAM_CHECK, NORM_STREAM_CHECK, EXITING

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
            print("Too many retries error caught; continuing...")
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

def loadDbConfig():
    global R_CONTROLLER, SYSTEM_STATE, ACTION_STATE, UPDATE_STAMP, DETECTION_MODE, TEMPERATURE_THRESHOLD, GRID_COL, GRID_ROW
    relays = list(DB_CONFIGS.find({ "category" : "relays" }))
    actions = list(DB_CONFIGS.find({ "category" : "actions", "disabled" : False }))
    updateStamp = DB_CONFIGS.find_one({"category" : "update", "config_name" : "update_stamp"})

    detectionMode = DB_CONFIGS.find_one({"category" : "config", "config_name" : "DetectionMode"})

    phs_grid_divisions = DB_CONFIGS.find_one({"category" : "config", "config_name" : "divisions"})
    
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

def process(raw):
    try:
        raw.shape = (24,32)
        raw = cv2.flip(raw,1)
        return raw
    except Exception as e: print("🚩 Can't Processs this raw thermal",e)
        
def start_server():
    global Yolov5_PHD, PHS_CNN, YOLO_DIR, WEIGHTS_DIR ,ACTION_STATE, CAM_THERMAL, CAM_NORMAL, RAW_THERMAL, SYSTEM_STATE, R_CONTROLLER, IMG_NORMAL_ANNOTATED, IMG_NORMAL, IMG_THERMAL
    print("⏳ Starting PHS ")

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
    
    CAM_NORMAL = Cam_Norm()

    CAM_THERMAL = cam_therm()
    time.sleep(0.1)

    ACTION_STATE = a_controller((),())
    
    print("⏳ Pulling Configs From DB")
    loadDbConfig()

    RAW_THERMAL = np.zeros((24*32,))        
    try:
        print("⏳ Loading Yolo V5 ")
        Yolov5_PHD = torch.hub.load(
                YOLO_DIR,
                'custom',
                path=WEIGHTS_DIR, 
                source='local',
                device = 'cpu',
                force_reload=True
            )
        print("✅ Done loading yolo")
    except Exception as e:
        print("ERROR PHS YOLO V5",e)
    print("⏳ Loading PHS Heat Stress CNN")

    PHS_CNN = tf.keras.models.load_model(os.path.join('models','mai_Net.h5'))
    
    print("✅ Loaded PHS Heat Stress CNN!")

    camThread = threading.Thread(target=readCams)
    camThread.daemon = True
    camThread.start()
    print("🧵 Init Thread Read Cameras")

    detectThread = threading.Thread(target=detectHeatStress)
    detectThread.daemon = True
    detectThread.start()
    print("🧵 Init Thread Heat Stress Detection")

    jobsThread = threading.Thread(target=updateJobs)
    jobsThread.daemon = True
    jobsThread.start()
    print("🧵 Init Jobs Thread")

    ip=get_ip_address()
    port=8000
    print(f'📍 Server can be found at http://{ip}:{port} or http://localhost:{port}')
    
    log = logging.getLogger('werkzeug')
    log.disabled = True

    app.run(host=ip, port=port, debug=False, threaded=True, use_reloader=False)

@atexit.register
def goodbye():
    global R_CONTROLLER, EXITING
    with lock:
        EXITING = True
    print("\n")
    print("⏾ PHS Turning OFF")
    R_CONTROLLER.offAll()
    print("💤 Good Bye ....")

if __name__ == '__main__':
	start_server()
