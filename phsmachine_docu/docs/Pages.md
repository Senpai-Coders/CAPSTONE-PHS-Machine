# PAGES
PHS provide pages that would help the user control & monitor the PHS Machine.

## Monitoring Page

On this page, you will be able to see the streaming, and other information about the systems current data readings and configurations.

![phs monitoring](_media/monitoring_page.png)

### Monitor Stream
This shows the streaming of what the PHS machine sees on its **Camera** & **Thermal Camera**. PHS machine will also show the annotated image of identified pig and their classification(HeatStress or Normal).

![phs monitoring](_media/monitoring_page.png)

### System Status Indicator

This indicates that current state of the system. These states can be

![indicator system state](_media/indicator_system_state.png)

- **Off** - Theres no communication from the PHS Detection System. This might indicate that the PHS Detection System is not running.
- **Disabled** - The PHS Detection System is running but it is disabled and will not detect nor resolve HeatStress
- **Connecting** - Attempt to connect to PHS Detection System
- **Debugging** - Resolving action is disabled to enable user to test relays and other PHS components that might be high voltage
- **Resolving** - The PHS Detection System is currently resolving a heatstress or running some actions
- **Detecting** - The normal status of PHS Detection System when scanning the area and the temperature of the pigs that is seen by the camera.


### Thermal Readings Indicator

![indicator system state](_media/indicator_system_state.png)

This shows the **Minimum, Average, and Maximum** temperature the thermal camera is reading. 

### System Storage Indicator

![indicator system state](_media/indicator_system_storage.png)

This indicates of how many storage left for the system. Currently, the system is using **32Gb** but you can change it with bigger storage.

> NOTE: There are some limitaion and **file system format** types when changing PI storage size. You should read about Pi 4 **supported File System** types and **maximum supported storage** size to prevent problems.

> NOTE: If **auto delete** is enabled, when the system storage exceed **95%** of the total storage, The system will **auto delete** old records to accomodate new detection records.

### Seen Pig Indicator

This shows the count of pig that is being identified by the system. The system will also count and classify each detected pig to **HeatStress** or **Normal**.

### Detection Indicator

This shows how many detection happened today

### Stream Layout Option

This shows quick option for the Streaming Layout. You have 3 options

![tripple](_media/indicator_stream_option.png)

- **Tripple View** - Normal, Thermal, Annotated is displayed
![tripple](_media/stream_triple.png)

- **Dual View** - Normal & Thermal are displayed
![dual](_media/stream_dual.png)

- **Merged View** - Normal & Thermal is merged together & displayed
![merged](_media/stream_merged.png)


### Actions Indicator

Actions indicator shows all actions that will be used by the system. It will show the **state** of the action and if the action is currently activated then the **duration** of activation will be displayed.

![action indic](_media/indicator_stream_option.png)


### Quick Controls Option

![quick controls indic](_media/indicator_quick_controls_option.png)

Quick controls is included to quickly change system state and setting without going to the settings page. If the system is **off** some of the controls will not be able to work.

### Active Users

![user indic](_media/indicator_user.png)

This indicates the current active users that is also using or monitoring the system.

### Past Detection Indicator

![past indic](_media/indicator_past.png)

Past detection shows the last 10 heat stress detections. You can **click** these to view more information about the detection record.

## Detection Page

Detection page contains all detection records that has been recorder by the system. You can view and manage this records here.

### Records Tab

This shows tabular view of the datas. You can **view, export, or delete** them.

### Visualization Tab

This shows visualization of all the data.

## Settings Page
PHS provides configurations for the system. You can configure settings, system state, detection mode, actions, and relay testing.

### Settings Tab

#### System State Control

![controls](_media/setting%20a.png)

Let's you control the system state. When the system is on **Debuging mode** or has been **stop**, you can put it back to it's normal state by clicking **Start PHS**. You can also **Shutdown or Reboot** the system. If the state is not showing correctly, you can click **refresh** to get the latest system state.

#### Heat Stress Detection Setting

![controls b](_media/setting%20b.png)

You can choose between **automatic detection** and **manual detection**. 
- **automatic detection** : will use custom trained CNN to identify **heat stress**.
- **manual detection** : will require you to put a preferred temperature threshold to identify **heat stress**

#### PHS Pov event cell division

![controls c](_media/fov%20settings.png)

PHS machine uses camera to see the piggery. PHS divide what it see's to a **grid of cells**. Each cells can be **bind** to certain **actions** and **events(pig event, heat stress event, dark scene event)** and if a certain event happens on the particular cell, **all** actions bind on that cell will be **activated**. You can change the grid size by changing **column** and **row** values. Maximum column can be up to **12** while rows can be up to **5** only. 

> **NOTE** : The number of column & rows will base on how many actions / relay you will be having for the system.

#### Yolo Weights & CNN Weights

This provide what available Weights can be used for PHS. These weights contains the **trained AI** and the data it **learned** from training, and if there are more options you can select what weights to use. You can add weights by asking the developers if there's new weights. 

#### Adding Weights to the system.

You can add new weights to the system by editing ```phsV1Defaults.json``` located at ```CAPSTONE-PHS-Machine/phsmachine_web/defaults/```

Then Depending on what the weights is for, you need to move it either ```maiCNNet``` or ```yolo``` which is located at ```CAPSTONE-PHS-Machine/Pig-Stress-DP-Algorithm/models/weights/```

> **NOTE** after adding weights. You must reset the system, uncheck all checkbox except settings, this will update the default settings with the new one you edited. Then the system will reboot.

#### Automatic Record Deletion & Hard Reset 

![last set](_media/last%20set.png)

**PHS Automatic Record Deletion** indicates that once **PHS** exceeds **95%** of total storage, instead of stop detecting, the system will **delete old records** automatically to accomodate new ones. 

**PHS Hard Reset** You can tell PHS what to reset by checking / unchecking the checkbox.

> **NOTE** : Please read the description on the checkboxes before confirming reset. Reset can wipe your detection datas and other exports.

> **TIP** : When exporting or zipping data, PHS will create a copy of these datas and create a downloadable links for them. These copies is not deleted so that the links will be available if the downloads failed or the system restarts unexpectedly. You can delete these cache using reset to freeup space.

### UI

### Actions

### Relays
These relays are the switches that controls any components that can be turned on and off by the system. Usually these components is **solenoid valve, pump, lights, etc..**. If the system is in **debugging mode** you can toggle these relays to test it's functionality.

> **NOTE** : Some of these relays handle high voltage components. Please be careful when testing