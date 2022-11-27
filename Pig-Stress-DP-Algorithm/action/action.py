class action:

# {  
#     "schema_v": 1,  
#     "category": "actions",  
#     "config_name": "Mist Div 1",  
#     "description": "This will be utilized by the AI",  
#     "value": {    
#         "targets": [      
#             {        
#                 "target_relay": "18",        
#                 "duration": 1      
#             }    
#                 ],    
#         "caller": "Pig Detector",    
#         "forceActivate": true,    
#         "eventLocation": 1  
#     },  
#     "disabled": false,  
#     "deletable": false,  
# }
    def __init__(self, category, config_name, description, targets, caller, forceActivate, eventLocation, state):
        self.category = category
        self.targets = []
        self.config_name = config_name
        self.description = description
        self.state = state
        self.caller = caller
        self.forceActivate  = forceActivate
        self.eventLocation = eventLocation
        self.elapsed = 0

        for targs in targets:
            self.targets.append(targs)

        print(f"◽ Init Actions : {self.config_name} {self.description} {self.state} {self.caller}")
   
    def toggle(self, state):
        self.state = state
        if not state:
            self.elapsed = 0
        #print(f"Toggled Action : {self.config_name} {self.state}")
    
    def setElapsed(self, sec):
        self.elapsed = sec

    def __str__(self):
        print(f"◽ Action : {self.config_name} {self.description} {self.state} {self.caller}")
