# PHS Error Codes

PHS may encounter **errors** in future. **Error codes** may help admins, developers on **tracing** or knowing what is the **caused** of error and the **possible fix**.

Error codes might appear on the **bell notification** located at the nav bar or Error codes might appear on the **Log page**

## Error Code **-1**

This error indicates that the PHS cannot **reset** or **initialize** it's initial settings due to **PHS default factory file configuration** can't be accessed or not found.

The default file configuration ```phsV1Defaults.json``` which is located at ```phsmachine_web/defaults/```. You can check if the file exist.

#### Possible Solution
- Try downloading the ```phsV1Defaults.json``` file from the [github repository phsmachine_web/defaults/](https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine/tree/main/phsmachine_web/defaults)

## Error Code **0**

This indicates that the **PHS Detection System** of PHS is **not running** or **can't be reached**. This may result to the possibility that it is **not running**. 

#### Possible Solution
- Check if router is responding or try rebooting the router or reboot both router & PHS
- Try rebooting the system
- Try reading the system log at the logs page
- Try reading the phs_system.service service logs
```
journalctl -u phs_system.service
```

## Error Code **1**

This indicates that the **Web Service** of PHS is **not running** or **cannot be reached**. This might be local network issue or the Web service failed to run.

#### Possible Solution
- Check if router is responding or try rebooting the router or reboot both router & PHS
- Try reading the phs_web.service logs
```
journalctl -u phs_web.service
```

## Error Code 3

This indicates that PHS storage **exceeds 95%** of the total storage.

#### Possible Solution
You can **old records** at the **detection page**  to free up some space.

> **TIP** You can follow the maintenance guid which include maintaining the PHS storage.


# Possible Undocumented Errors

We **highly encourage** to report **errors** that are **not** in this manual/documentation inorder to improve the system's error handling and support.

#### Email the developer & send the following

- Log Files (Both PHS Web & PHS Detection System Logs)

> **TIP** : You can download the logs at the Log Page

> **TIP** : You can also connect via SSH or VNC to the phs and on terminal you can run ```journalctl -u phs_system.service``` && ```journalctl -u phs_web.service``` to view the logs, and take a screenshot of the errors.

- Description of what wen't wrong (on your own words)
- Date of error
