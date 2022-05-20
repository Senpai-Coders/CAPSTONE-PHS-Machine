import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

class relay:
    def __init__(self, GPIO_PIN, NAME, DESCRIPTION , STATE=False, DURATION=-1):
        self.PIN = GPIO_PIN
        self.NAME = NAME
        self.DESCRIPTION = DESCRIPTION
        self.STATE = STATE
        GPIO.setup(GPIO_PIN, GPIO.OUT)
        print(f'Initialized Relay {NAME} : {GPIO_PIN} : {STATE}')
    
    def toggle(self, STATE):
        GPIO.output(STATE)
        print(f"Toggled Relay {self.NAME} : {self.PIN} -> {STATE}")