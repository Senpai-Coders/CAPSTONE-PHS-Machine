from fnmatch import translate
from .relay import relay

class r_controller:    
    
    def __init__(self, relays, isActiveLow):
        self.RELAYS = []
        self.isActiveLow = isActiveLow
        for r in relays:
            R = relay(
                NAME=r['config_name'],
                DESCRIPTION=r['description'],
                GPIO_PIN=(r['value']['GPIO_PIN']),
                USED=(r['value']['isUsed']),
                isActiveLow=isActiveLow
            )
            self.RELAYS.append(R)

    def toggleRelay(self, target, state):
        for r in self.RELAYS:
            if r.NAME == target:
                r.toggle(state)
                break

    def offAll(self):
        for r in self.RELAYS:
            r.toggle(False)
        
    def onAll(self):
        for r in self.RELAYS:
            r.toggle(True)

    def getAllRelays(self):
        relDict = []
        for r in self.RELAYS:
            relDict.append(r.toDict())
        return relDict

    def delRelays(self, relays):
        self.RELAYS = []
        for r in relays:
            R = relay(
                NAME=r['config_name'],
                DESCRIPTION=r['description'],
                GPIO_PIN=(r['value']['GPIO_PIN']),
                USED=(r['value']['isUsed']),
                isActiveLow=self.isActiveLow
            )
            self.RELAYS.append(R)

    def __del__(self):
        self.RELAYS = []