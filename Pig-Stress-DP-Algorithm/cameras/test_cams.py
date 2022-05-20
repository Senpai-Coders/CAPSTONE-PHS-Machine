#from cam_thermal import cam_therm
from cam_normal import Camera
import cv2
import numpy as np

#x = cam_therm()
y = Camera()

while True:
    #RAW, PROCESSED = x.getThermal()
    img2 = y.get_frame()
    PROCESSED = img2

    IM1 = cv2.resize(PROCESSED, (400,400))
    IM2 = cv2.resize(img2, (400,400))
    
    Hori = np.concatenate((IM1, IM2), axis=1)
    cv2.imshow('HORIZONTAL', Hori)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    #cv2.imwrite('th.jpg', thermal)
    #cv2.imwrite('image.jpg', image)

y.release_camera()
