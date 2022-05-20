from concurrent.futures import thread
from ipaddress import ip_address
from flask import Response, request
from flask import Flask
from flask import render_template
import threading
import time, socket, logging, traceback
import cv2
import numpy as np

from cameras.cam_normal import Cam_Norm

lock = threading.Lock()

outputFrame = None
thermcam = None
lock = threading.Lock()

IMG_THERMAL = cv2.imread("test_img/pig-thermal.png")

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello from PHS"

@app.route("/video_feed")
def video_feed():
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")
    
def pull_images():
    global outputFrame
	# loop over frames from the video stream
    CAM = Cam_Norm()
    while True:
        current_frame=None
        try:
            norm_frame, byte = CAM.get_frame()
            outputFrame = norm_frame
            print('working', outputFrame.shape)
        except Exception as e:
            print('err', e)
            break
            
        if current_frame is not None:
            with lock:
                outputFrame = current_frame.copy()

def generate():
	global outputFrame, lock
	while True:
		with lock:
			if outputFrame is None:
				continue
			(flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
			if not flag:
				continue
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address


def start_server():
    time.sleep(0.1)

    t = threading.Thread(target=pull_images)
    t.daemon = True
    t.start()

    ip = get_ip_address()
    port = 8000

    print(f'server can be found at {ip}:{port}')

    app.run(host=ip, port=port, debug=True,threaded=True, use_reloader=True)


if __name__ == '__main__':
    start_server()