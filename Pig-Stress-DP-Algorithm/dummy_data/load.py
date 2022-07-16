import os
import pickle as pkl
import numpy as np
import cv2

img = cv2.imread('img_normal.png')
thermal_data = pkl.load(open('raw_thermal.pkl', 'rb'))

def process(raw):
    try:
        raw.shape = (24,32)
        raw = cv2.flip(raw,1)
        return raw
    except Exception as e: print("Err",e)

img_thermal = process(thermal_data)

print(img_thermal )

