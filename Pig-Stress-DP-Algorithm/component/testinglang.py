from os import stat
from r_controller import r_controller
import time

relays = [
    {
        "category": "relays",
        "config_name": "Relay_1",
        "description": "Relay 1 On 4 Channel Relay",
        "value": {
            "GPIO_PIN": 14,
            "isUsed": True
        }
    },
    {
        "category": "relays",
        "config_name": "Relay_2",
        "description": "Relay 2 On 4 Channel Relay",
        "value": {
            "GPIO_PIN": 15,
            "isUsed": True
        }
    }
]

controller = r_controller(relays, isActiveLow=True)
time.sleep(5)
print("\nON")
controller.onAll()
print(controller.getAllRelays())
time.sleep(5)
print("\nOFF")
controller.offAll()
print(controller.getAllRelays())
time.sleep(5)
print("\n On 14")
controller.toggleRelay("Relay_1",True)
print(controller.getAllRelays())
time.sleep(5)
controller.toggleRelay("Relay_1",False)
print("\n On 15")
controller.toggleRelay("Relay_2",True)
print(controller.getAllRelays())
time.sleep(5)
