from a_controller import a_controller

c = a_controller((
    {
        "config_name": "Fan",
        "description": "This will be utilized by the AI",
        "value": {
            "duration": 1,
            "target_relay": "Relay_2",
        },
        "disabled": False,
    },
    {
        "config_name": "Mist",
        "description": "This will be utilized by the AI",
        "value": {
            "duration": 13,
            "target_relay": "Relay_1",
        },
        "disabled": True,
    }
), ())

c.toggle('Mist', True)
c.toggle('Fan', True)

c.reInit(({
        "config_name": "Fan",
        "description": "This will be utilized by the AI",
        "value": {
            "duration": 1,
            "target_relay": "Relay_2",
        },
        "disabled": True,
    },
    {
        "config_name": "Mist",
        "description": "This will be utilized by the AI",
        "value": {
            "duration": 13,
            "target_relay": "Relay_1",
        },
        "disabled": False,
    },{
        "config_name": "Lights",
        "description": "This will be utilized by the AI",
        "value": {
            "duration": 13,
            "target_relay": "Relay_3",
        },
        "disabled": False,
    }), c.actions)
