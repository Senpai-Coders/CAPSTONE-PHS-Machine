isPi = True

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


YOLO_DIR = os.path.join('models','Yolov5')
WEIGHTS_DIR = os.path.join('best.pt')


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
    global SYSTEM_STATE,R_CONTROLLER
    # -2 Off
    # -1 Disabled
    # 0 Detecting
    # 1 Resolving
    # 2 Debugging
    # 3 Connecting
    status = request.args.get('status')
    if(int(status) == 2):
        R_CONTROLLER.offAll()
    elif int(status) == 0:
        R_CONTROLLER.offAll()
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

def detectHeatStress():
    global IMG_NORMAL_ANNOTATED, PHS_CNN, IMG_NORMAL, IMG_THERMAL, RAW_THERMAL, Yolov5_PHD
    print('init detect heatstress', isPi)
    while True and isPi:
        loadDbConfig()
        if IMG_NORMAL is not None and IMG_THERMAL is not None:
            c_IMG_NORMAL = IMG_NORMAL
            c_IMG_THERMAL = IMG_THERMAL
            c_RAW_THERMAL = RAW_THERMAL
            c_Raw_Reshaped = np.reshape(c_RAW_THERMAL.copy(), (24,32))
            c_Raw_Reshaped = cv2.resize(c_Raw_Reshaped, (640, 480))
            c_Raw_Reshaped = cv2.flip(c_Raw_Reshaped, 1)

            curACTIONS = []

            to_read = c_IMG_NORMAL.copy()

            # DETECT IF SCENE IS DARK
            # CALL ALL ACTION THAT IS BIND TO DARK SCENE EVENT
            Dark_Scene_Detector = isDarkScene(to_read) 
            if Dark_Scene_Detector:
                curACTIONS = activateCategory(curACTIONS, "Dark Scene Detector")
            
            # FEEDING IMAGE FOR FINDING THE PIG LOCATION ON PICTURE USING YOLOV5s 
            print("Detecting Pig")
            detect_pig_head = Yolov5_PHD(to_read) 
            print("Done Detect")
            print("Returned Bbox", detect_pig_head)

            coords = detect_pig_head.pandas().xyxy[0].to_dict(orient="records")
        
            if len(coords) > 0:
                # CALL ALL ACTIONS FOR PIG DETECTOR
                curACTIONS = activateCategory(curACTIONS, "Pig Detector")
                print(f"PHS Detect detected {len(coords)} pigs🐖")

                detect_annotation = np.squeeze(detect_pig_head.render())
                
                print("Saving Detection", len(coords))

                img_normal_cropped = []
                img_thermal_cropped = []
                img_thermal_cropped_raw = []
                img_thermal_cropped_info = []

                mins = []
                avgs = []
                maxs = []

                detected = False
                
                for result in coords:
                    if not hasNoPendingHeatStressJob():
                        break

                    x1 = int(result['xmin'])
                    y1 = int(result['ymin'])
                    x2 = int(result['xmax'])
                    y2 = int(result['ymax'])
                    print('pig at coord :',x1,y1,x2,y2)
                    cpy_thrm_crop_raw = c_Raw_Reshaped[y1:y2, x1:x2]

                    # detection = CNN ( RAW THERMAL )
                    converted_img = conv_img(cpy_thrm_crop_raw)
                    identify_pig_stress = PHS_CNN.predict(converted_img)
                    classes =  ['Heat Stressed', 'Normal']
                    classification = classes[np.argmax(identify_pig_stress)]
                    print('CLASSIFICATION : ', classification)
                    
                    # TODO # NOTE Remove 'np.max <=39.0' On Final Training of PHS Detector
                    if classification == classes[1] and np.max(cpy_thrm_crop_raw) <= 39.0:
                        continue
                        
                    detected = True
                    # If it does classified stressed then set as detected to true
                    # also call the action bind to HEAT STRESS DETECTOR  
                    curACTIONS = activateCategory(curACTIONS, "Heat Stress Detector")
                    print("PHS Detected 🔥  Heat Stress on pig")

                    cpy_crop_normal = c_IMG_NORMAL[y1 : y2, x1 : x2]
                    cpy_thrm_crop = c_IMG_THERMAL[y1 : y2, x1 : x2]

                    img_thermal_cropped_raw.append(cpy_thrm_crop_raw)
                    img_normal_cropped.append(cpy_crop_normal)
                    img_thermal_cropped.append(cpy_thrm_crop)

                    # constructing subinfo of the subcropped coords
                    min_temp = np.min(cpy_thrm_crop_raw)
                    avg_temp = np.mean(cpy_thrm_crop_raw)
                    max_temp = np.max(cpy_thrm_crop_raw)

                    infoObj = { 'min_temp' : min_temp, 'avg_temp' : avg_temp, 'max_temp' : max_temp }
                    img_thermal_cropped_info.append(infoObj)
                    mins.append(min_temp)
                    avgs.append(avg_temp)
                    maxs.append(max_temp)

                curt = datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")

                if detected:
                    overal_min_temp = sum(mins) / len(mins)
                    overal_avg_temp = sum(avgs) / len(avgs)
                    overal_max_temp = sum(maxs) / len(maxs)
                    
                    #call save function XD to save the heat stress event
                    saveDetection(c_IMG_NORMAL, c_IMG_THERMAL, c_RAW_THERMAL, detect_annotation, curt, img_normal_cropped, img_thermal_cropped, img_thermal_cropped_raw, len(coords), img_thermal_cropped_info, overal_min_temp, overal_avg_temp, overal_max_temp, curACTIONS)
                    with lock:
                        SYSTEM_STATE['status'] = 1
                    if not EMERGENCY_STOP:
                        print('do action here later')

                with lock:
                    IMG_NORMAL_ANNOTATED = detect_annotation
                    SYSTEM_STATE['pig_count'] = len(coords)

            else:
                with lock:
                    SYSTEM_STATE['pig_count'] = 0

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
            "actions": Actions_did
        }

        x = 1
        print("RANGE", len(croped_normal))
        for i in range(len(croped_normal)):
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

        print("Saving Real Rec")
        cv2.imwrite(f"{path1}/img_normal.png", normal)
        cv2.imwrite(f"{path1}/img_annotated.png", normal_annotated)
        cv2.imwrite(f"{path1}/img_thermal.png", thermal)

        DB_DETECTIONS.insert_one( DATA_DICT )

        p = pickle.dump( raw_thermal, open(f'../phsmachine_web/public/detection/Detection-{stmp}/raw_thermal.pkl', 'wb'))
        print("SAVED")
    except Exception as e:
        print(e)


# This is for testing only to test if activate action is working
@app.route("/DummyActivateCategory", methods=['POST'])
def fakeActivate():
    global ACTION_STATE
    ReqBod = request.get_json(force=True)
    callerName = ReqBod['caller']
    activateCategory([ ], callerName)

    return "ok",200


def activateCategory(old_activate, caller):
    global ACTION_STATE, SYSTEM_STATE

    if SYSTEM_STATE['status'] == 2:
        return

    actions = list(DB_CONFIGS.find({ "category" : "actions", "disabled" : False }))
    
    new_activated = []

    for action in actions:
        act_caller = action['value']['caller']
        target_relay = action['value']['target_relay']
        duration = int(action['value']['duration'])
        action_name = action['config_name']

        if act_caller == caller:
            activated = activateJob(target_relay, duration, action_name, caller)
            ACTION_STATE.toggle(action_name, True)
            new_activated.append(activated)

    return old_activate + new_activated

def activateJob(name, duration, action_name, caller):
    global SYSTEM_STATE

    endTime = datetime.now() + timedelta(seconds=duration)

    newJob = {
            "action_name" : action_name,
            "relay_name" : name,
            "caller" : caller,
            "duration" : duration,
            "end" : endTime
            }
    SYSTEM_STATE['jobs'].append(newJob)
    return newJob

def updateJobs():
    global SYSTEM_STATE, R_CONTROLLER, ACTION_STATE

    if EMERGENCY_STOP or SYSTEM_STATE['status'] == 2:
        SYSTEM_STATE['jobs'] = []
        R_CONTROLLER.offAll()
        ACTION_STATE.offAll()
    
    print("*********** PHS ACTIONS JOBS *****************\n")
    print(SYSTEM_STATE['jobs'])
    print("\n**********************************************")

    for idx, job in enumerate(SYSTEM_STATE['jobs']):
        endTime = job['end']
        curTime = datetime.now()
        if curTime >= endTime:
            print('PHS JOB : ACTION ENDED ')
            R_CONTROLLER.toggleRelay(job['relay_name'],False)
            SYSTEM_STATE['jobs'].pop(idx)
            ACTION_STATE.toggle(job['action_name'], False)
        else:
            print('PHS JOB : ACTIVE ACTION/JOB ', job['relay_name'])
            R_CONTROLLER.toggleRelay(job['relay_name'],True)

def isDarkScene(image):
    dim=20
    thresh=0.3

    image = cv2.resize(image, (dim, dim))
    L, A, B = cv2.split(cv2.cvtColor(image, cv2.COLOR_BGR2LAB))
    L = L/np.max(L)
    res = np.mean(L) < thresh
    if res:
        print(f"PHS Camera Seems seing very 🌃 dark scene.{np.mean(L)} gastug di ako makakita 😣")
    else:
        print(f"PHS Camera seems seing👀 fine.{np.mean(L)}")
    return res

def readCams():
    global IMG_NORMAL, CAM_THERMAL, CAM_NORMAL, IMG_THERMAL, RAW_THERMAL, SYSTEM_STATE, isPi
    print('init thread readcams', CAM_THERMAL, CAM_NORMAL)    
    if not isPi:
        while CAM_NORMAL is not None:
            current_frame = None
            try:
                current_frame, byts = CAM_NORMAL.get_frame()
            except Exception as e:
                print("err ", e)
            if current_frame is not None:
                with lock:
                    IMG_NORMAL = current_frame
        return

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
    global R_CONTROLLER, SYSTEM_STATE, ACTION_STATE, UPDATE_STAMP
    relays = list(DB_CONFIGS.find({ "category" : "relays" }))
    actions = list(DB_CONFIGS.find({ "category" : "actions", "disabled" : False }))
    updateStamp = DB_CONFIGS.find_one({"category" : "update", "config_name" : "update_stamp"})
    
    newUpdateStamp = updateStamp['value'] 
    hasNewUpdateStamp = False
    
    if UPDATE_STAMP is None or UPDATE_STAMP != newUpdateStamp:
        hasNewUpdateStamp = True
        with lock:
            UPDATE_STAMP = newUpdateStamp
   
    if R_CONTROLLER is not None:
        if (len(R_CONTROLLER.getAllRelays()) != len(relays) or hasNewUpdateStamp)  and isPi:
            R_CONTROLLER.delRelays(relays)      
    else:
        R_CONTROLLER = r_controller(relays, True, isPi)

    if len(ACTION_STATE.actions) != len(actions) and isPi:
        ACTION_STATE = a_controller(actions, ACTION_STATE.actions)

    updateJobs()

def process(raw):
    try:
        raw.shape = (24,32)
        raw = cv2.flip(raw,1)
        return raw
    except Exception as e: print("Err",e)
        
def start_server():
    global Yolov5_PHD, PHS_CNN, YOLO_DIR, WEIGHTS_DIR ,ACTION_STATE, CAM_THERMAL, CAM_NORMAL, RAW_THERMAL, SYSTEM_STATE, R_CONTROLLER, IMG_NORMAL_ANNOTATED, IMG_NORMAL, IMG_THERMAL

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

    if isPi:
        CAM_THERMAL = cam_therm()
        time.sleep(0.1)
    else:
        RAW_THERMAL = pickle.load(open('dummy_data/raw_thermal.pkl','rb'))
        IMG_THERMAL = process(RAW_THERMAL) 
        IMG_NORMAL = cv2.imread('dummy_data/img_normal.png')

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
    
    log = logging.getLogger('werkzeug')
    log.disabled = True

    app.run(host=ip, port=port, debug=False, threaded=True, use_reloader=False)

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
