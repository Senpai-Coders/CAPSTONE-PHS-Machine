import time,board,busio, traceback
import numpy as np
import adafruit_mlx90640
import datetime as dt
import cv2
import logging
import cmapy
from scipy import ndimage

logging.basicConfig(filename='pithermcam.log',filemode='a',
                    format='%(asctime)s %(levelname)-8s [%(filename)s:%(name)s:%(lineno)d] %(message)s',
                    level=logging.WARNING,datefmt='%d-%b-%y %H:%M:%S')
logger = logging.getLogger(__name__)

class cam_thermal:
    _colormap_list=['jet','bwr','seismic','coolwarm','PiYG_r','tab10','tab20','gnuplot2','brg']
    _interpolation_list =[cv2.INTER_NEAREST,cv2.INTER_LINEAR,cv2.INTER_AREA,cv2.INTER_CUBIC,cv2.INTER_LANCZOS4,5,6]
    _interpolation_list_name = ['Nearest','Inter Linear','Inter Area','Inter Cubic','Inter Lanczos4','Pure Scipy', 'Scipy/CV2 Mixed']
    _current_frame_processed=False  # Tracks if the current processed image matches the current raw image
    i2c=None
    mlx=None
    _temp_min=None
    _temp_max=None
    _raw_image=None
    _image=None
    _file_saved_notification_start=None
    _displaying_onscreen=False
    _exit_requested=False

    def __init__(self,use_f:bool = True, filter_image:bool = False, image_width:int=1200, 
                image_height:int=900, output_folder:str = '/home/pi/pithermalcam/saved_snapshots/'):
        self.use_f=use_f
        self.filter_image=filter_image
        self.image_width=image_width
        self.image_height=image_height
        self.output_folder=output_folder

        self._colormap_index = 0
        self._interpolation_index = 3
        self._setup_therm_cam()
        self._t0 = time.time()
        self.update_image_frame()