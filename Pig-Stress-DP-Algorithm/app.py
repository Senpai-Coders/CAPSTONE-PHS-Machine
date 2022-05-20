from flask import Response, request
from flask import Flask
from flask import render_template
import threading
import time, socket, logging, traceback
import cv2
from cameras.cam_normal import Cam_Norm
from cameras.cam_thermal import cam_therm
import numpy as np

IMG_NORMAL=None
IMG_THERMAL=None
THERMAL_CAM=None
RAW_THERMAL=None
lock = threading.Lock()

app = Flask(__name__)

@app.route("/")
def index():
	return "Hello"

@app.route("/normal_feed")
def feed_normal():
	return Response(gen_normal(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route("/thermal_feed")
def feed_thermal():
	return Response(gen_thermal(), mimetype="multipart/x-mixed-replace; boundary=frame")
    

def get_ip_address():
	"""Find the current IP address of the device"""
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("8.8.8.8", 80))
	ip_address=s.getsockname()[0]
	s.close()
	return ip_address

def pull_images():
    global IMG_NORMAL, THERMAL_CAM, IMG_THERMAL, RAW_THERMAL
    Cam = Cam_Norm()
    while THERMAL_CAM is not None:
        current_frame=None
        thermal_frame=None
        raw_thermal=None
        try:
            current_frame, byts = Cam.get_frame()
            raw, processed = THERMAL_CAM.getThermal()
            thermal_frame = processed
            raw_thermal = raw
        except Exception:
            print("Too many retries error caught; continuing...")
        if current_frame is not None and thermal_frame is not None:
            with lock:
                IMG_NORMAL = current_frame.copy()
                IMG_THERMAL = thermal_frame.copy()
                RAW_THERMAL = raw_thermal.copy()

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

def start_server():
    global THERMAL_CAM, RAW_THERMAL
    RAW_THERMAL = np.zeros((24*32,))
    THERMAL_CAM = cam_therm()
    time.sleep(0.1)
    t = threading.Thread(target=pull_images)
    t.daemon = True
    t.start()
    ip=get_ip_address()
    port=8000
    print(f'Server can be found at {ip}:{port}')
    app.run(host=ip, port=port, debug=True, threaded=True, use_reloader=False)


if __name__ == '__main__':
	start_server()
