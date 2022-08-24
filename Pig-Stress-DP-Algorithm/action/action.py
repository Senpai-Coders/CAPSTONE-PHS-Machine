class action:
    def __init__(self, config_name, description, caller, state):
        self.config_name = config_name
        self.description = description
        self.state = state
        self.caller = caller
        print(f"◽ Init Actions : {self.config_name} {self.description} {self.state} {self.caller}")
   
    def toggle(self, state):
        self.state = state
        #print(f"Toggled Action : {self.config_name} {self.state}")

    def __str__(self):
        print(f"◽ Action : {self.config_name} {self.description} {self.state} {self.caller}")
