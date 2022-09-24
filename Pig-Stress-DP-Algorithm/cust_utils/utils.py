import json

def mongoResToJson(obj): 
    parsed = json.dumps(obj, indent=4, default=str)
    return parsed