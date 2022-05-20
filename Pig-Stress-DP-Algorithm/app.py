from flask import Response, request
from flask import Flask
from flask import render_template
import threading
import time, socket, logging, traceback
import cv2
from cameras.cam_normal import Cam_Norm

IMG_NORMAL = None
lock = threading.Lock()

app = Flask(__name__)

@app.route("/")
def index():
	return "Hello"

@app.route("/video_feed")
def video_feed():
	return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

def get_ip_address():
	"""Find the current IP address of the device"""
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("8.8.8.8", 80))
	ip_address=s.getsockname()[0]
	s.close()
	return ip_address

def pull_images():
    global IMG_NORMAL
    Cam = Cam_Norm()
    while True:
        current_frame=None
        try:
            current_frame, byts = Cam.get_frame()
        except Exception:
            print("Too many retries error caught; continuing...")
        if current_frame is not None:
            with lock:
                IMG_NORMAL = current_frame.copy()

def generate():
	global IMG_NORMAL, lock
	while True:
		with lock:
			if IMG_NORMAL is None:
				continue
			(flag, encodedImage) = cv2.imencode(".jpg", IMG_NORMAL)
			if not flag:
				continue
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

def start_server():
	time.sleep(0.1)

	t = threading.Thread(target=pull_images)
	t.daemon = True
	t.start()

	ip=get_ip_address()
	port=8000

	print(f'Server can be found at {ip}:{port}')

	app.run(host=ip, port=port, debug=True,threaded=True, use_reloader=False)


if __name__ == '__main__':
	start_server()
