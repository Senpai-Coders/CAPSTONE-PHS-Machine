import cv2
class Camera():
    def __init__(self):
        self.CAM = cv2.VideoCapture(0)  # Prepare the camera...
        self.CAM.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        print("Camera warming up ...")

    def get_frame(self):
        ret, frame = self.CAM.read()
        return frame

    def release_camera(self):
        self.CAM.release()

def main():
   while True:
        cam1 = Camera().get_frame()
        frame = cv2.resize(cam1, (0, 0), fx = 0.75, fy = 0.75)
        cv2.imshow("Frame", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            Camera().release_camera()
            return ()

if __name__ == '__main__':
    main()
    cv2.destroyAllWindows()
