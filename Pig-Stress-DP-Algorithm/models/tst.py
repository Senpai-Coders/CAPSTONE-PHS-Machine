import torch
from matplotlib import pyplot as plt
import numpy as np
import cv2
import os

import warnings
warnings.filterwarnings("ignore") # Warning will make operation confuse!!!

YOLO_DIR = os.path.join('Yolov5')
WEIGHTS_DIR = os.path.join('best.pt')

print("YOLDIR",YOLO_DIR,"WEIGHTS", WEIGHTS_DIR)

model = torch.hub.load(
    YOLO_DIR,
    'custom',
    path=WEIGHTS_DIR, 
    source='local',
    device = 'cpu',
    force_reload=True
) 

img = 'dummy_data/img_normal.png'
img = cv2.imread(img)
results = model(img)
results.pred

 
example = np.squeeze(results.render())
plt.imsave('example.jpg',example )
plt.imshow(example)
plt.show()
