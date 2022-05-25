from .action import action

class a_controller:
    def __init__(self, pulled_action, existing_action):
        self.actions = list()
        for A in pulled_action:
            flag, state = self.doesExist(A['config_name'], existing_action)
            if not flag:
                state = False

            Action = action(
                config_name=A['config_name'],
                description=A['description'],
                duration=A['value']['duration'],
                target_relay=A['value']['target_relay'],
                state=state
            )

            self.actions.append(Action)

    def doesExist(self, act_name, existing_action):
        if len(existing_action) == 0: return False, None
        for E in existing_action:
            if E.config_name == act_name:
                return True, E.state
        return False, None

    def toggle(self, config_name, state):
        for A in self.actions:
            if A.config_name == config_name:
                A.toggle(state)

    def toDict(self):
        actions = []
        for A in self.actions:
            actions.append(vars(A))
        return actions
        
    def reInit(self, pulled_action, existing_action):
        self.actions = []
        for A in pulled_action:
            flag, state = self.doesExist(A['config_name'], existing_action)
            if not flag:
                state = False

            Action = action(
                config_name=A['config_name'],
                description=A['description'],
                duration=A['value']['duration'],
                target_relay=A['value']['target_relay'],
                state=state
            )

            self.actions.append(Action)