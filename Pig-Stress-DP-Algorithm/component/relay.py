import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

class relay:
    def __init__(self, GPIO_PIN, NAME, DESCRIPTION, USED, isActiveLow, STATE=False):
        self.GPIO_PIN = GPIO_PIN
        self.NAME = NAME
        self.DESCRIPTION = DESCRIPTION
        self.STATE = True if isActiveLow else False
        self.isActiveLow = isActiveLow
        self.USED = USED
        GPIO.setup(GPIO_PIN, GPIO.OUT)
        GPIO.output(self.GPIO_PIN, self.STATE)
        print(f'Relay Initialized : {NAME} -> {GPIO_PIN} -> {STATE}')

    def toDict(self):
        DICT = {
            "category" : "relays",
            "config_name" : self.NAME,
            "description" : self.DESCRIPTION,
            "GPIO_PIN" : self.GPIO_PIN,
            "state" : self.STATE if not self.isActiveLow else not self.STATE,
            "used" : self.USED
        }
        return DICT

    def translateState(self, state):
        if self.isActiveLow:
            return not state
        return state

    def stateToWord(self, state):
        if self.isActiveLow:
            return "LOW/Off" if state else "HIGH/ON"
        return "LOW/Off" if not state else "HIGH/ON"
    
    def toggle(self,STATE):
        self.STATE= self.translateState(STATE)
        GPIO.output(self.GPIO_PIN,self.STATE)
        print(f"Relay Toggled : {self.NAME} -> {self.GPIO_PIN} -> {self.STATE} -> {self.stateToWord(self.STATE)}")

    def __str__(self):
            return f"PIN: {self.GPIO_PIN}, Name: {self.NAME}, State: {self.STATE}, {self.stateToWord(self.STATE)}\nDescription: { self.DESCRIPTION }"

    def __del__(self):
        self.toggle(False)
        GPIO.cleanup()