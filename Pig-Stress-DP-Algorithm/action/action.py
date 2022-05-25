class action:
    def __init__(self, config_name, description, target_relay, duration, state):
        self.config_name = config_name
        self.description = description
        self.target_relay = target_relay
        self.duration = duration
        self.state = state
        print(f"Init Actions : {self.config_name} {self.description} {self.target_relay} {self.duration} {self.state}")
   
    def toggle(self, state):
        self.state = state
        print(f"Toggled Action : {self.config_name} {self.state}")

    def __str__(self):
        print(f"Action : {self.config_name} {self.description} {self.target_relay} {self.duration} {self.state}")