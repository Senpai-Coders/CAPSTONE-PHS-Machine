import numpy as np
import cmapy
import cv2
from scipy import ndimage
import adafruit_mlx90640
import time,board,busio


class cam_therm:
    i2c=None
    mlx=None
    isRaw=False 
    CV2_COLMAPS=['inferno','gnuplot2','gnuplot2_r','hot','magma']
    INTERPOLS =[cv2.INTER_NEAREST,cv2.INTER_LINEAR,cv2.INTER_AREA,cv2.INTER_CUBIC,cv2.INTER_LANCZOS4,5,6]
    TEMP_MIN=0
    TEMP_MAX=120
    RAW_THERMAL=None
    PROCESSED_THERMAL=None

    def __init__(self, IMG_WIDTH:int=400, IMG_HEIGHT:int=400 ):
        self.IMG_WIDTH= IMG_WIDTH
        self.IMG_HEIGHT= IMG_HEIGHT
        self.CHOSEN_CV2_COLMAP = 0
        self.INTERPOL = 3 #3 
        self._setup_therm_cam()

    def _setup_therm_cam(self):
        self.i2c = busio.I2C(board.SCL, board.SDA, frequency=1000000)
        self.mlx = adafruit_mlx90640.MLX90640(self.i2c)
        self.mlx.refresh_rate = adafruit_mlx90640.RefreshRate.REFRESH_16_HZ  # set refresh rate
        time.sleep(0.1)

    def MINMAXAVG(self):
        self.TEMP_MIN = np.min(self.RAW_THERMAL)
        self.TEMP_MAX = np.max(self.RAW_THERMAL)

    def READ_RAW_MLX_THERMAL(self):
        self.RAW_THERMAL = np.zeros((24*32,))
        try:
            self.mlx.getFrame(self.RAW_THERMAL) 
            print("R", self.RAW_THERMAL.shape)
            self.TEMP_MIN = np.min(self.RAW_THERMAL)
            self.TEMP_MAX = np.max(self.RAW_THERMAL)
            self.RAW_THERMAL = self.RESCALE(self.RAW_THERMAL,self.TEMP_MIN,self.TEMP_MAX)
            self.isRaw=False 
            print("A2", self.RAW_THERMAL.shape)
        except ValueError:
            print("Math error; continuing...")
            self.RAW_THERMAL = np.zeros((24*32,)) 
            print("E1", self.RAW_THERMAL.shape)
        except OSError:
            print("IO Error; continuing...")
            self.RAW_THERMAL = np.zeros((24*32,))
            print("E2", self.RAW_THERMAL.shape)


    def PROCESS_RAW(self):
        try:
            if self.INTERPOL==5:  # Scale via scipy only - slowest but seems higher quality
                self.PROCESSED_THERMAL = ndimage.zoom(self.RAW_THERMAL,25)  # interpolate with scipy
                self.PROCESSED_THERMAL = cv2.applyColorMap(self.PROCESSED_THERMAL, cmapy.cmap(self.CV2_COLMAPS[self.CHOSEN_CV2_COLMAP]))
            elif self.INTERPOL==6:  # Scale partially via scipy and partially via cv2 - mix of speed and quality
                self.PROCESSED_THERMAL = ndimage.zoom(self.RAW_THERMAL,10)  # interpolate with scipy
                self.PROCESSED_THERMAL = cv2.applyColorMap(self.PROCESSED_THERMAL, cmapy.cmap(self.CV2_COLMAPS[self.CHOSEN_CV2_COLMAP]))
                self.PROCESSED_THERMAL = cv2.resize(self.PROCESSED_THERMAL, (920,720), interpolation=cv2.INTER_CUBIC)
            else:
                self.PROCESSED_THERMAL = cv2.applyColorMap(self.RAW_THERMAL, cmapy.cmap(self.CV2_COLMAPS[self.CHOSEN_CV2_COLMAP]))
                self.PROCESSED_THERMAL = cv2.resize(self.PROCESSED_THERMAL, (920,720), interpolation=self.INTERPOLS[self.INTERPOL])
            self.PROCESSED_THERMAL = cv2.flip(self.PROCESSED_THERMAL, 1)
        except Exception:
            print("Err")

    def UPDATE(self):
        self.READ_RAW_MLX_THERMAL()
        self.PROCESS_RAW()
        self.isRaw=True
        return self.PROCESSED_THERMAL

    def RESCALE(self,f,Tmin,Tmax):
        f=np.nan_to_num(f)
        norm = np.uint8((f - Tmin)*255/(Tmax-Tmin))
        norm.shape = (24,32)
        return norm

    def getThermal(self):
        while True:
            try:
                PROCESSED = self.UPDATE()
                RAW = self.RAW_THERMAL
                return RAW, PROCESSED
            except RuntimeError as e:
                if e.message == 'Too many retries':
                    print("i2c speed err")
                    continue
                raise

if __name__ == "__main__":
    thermcam = cam_therm()  # Instantiate class
    while(True):
        raw, frame = thermcam.getThermal()
        cv2.imshow('frame', frame)
      
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
  
    cv2.destroyAllWindows()
