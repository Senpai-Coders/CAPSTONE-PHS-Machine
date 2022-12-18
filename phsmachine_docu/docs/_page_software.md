# Software Installation ( RARE )

**Out of the box, PHS software is **pre-installed and configured**.

In some cases, you may want to build your **own PHS**, or your current PHS has been **corrupted** and some OS reinstallation and PHS software installation is required. Contact the developer for help or we suggest that you ask for someone who have the following **skills**.

- Linux Shell
- Python
- Git
- Python
- Conda
- Configuration

## Required Hardware

<center>
    <img src="/docs/_media/phs_hardware.png">
</center>

PHS is using **Raspberry Pi 4 B 8Gb**. And due to fund limitations, we haven't tested it using other mini-computers.

## Required OS

<center>
    <img src="/docs/_media/rpilogo.png">
</center>

PHS Machine utilizes **Raspberry Pi 4B** Architecture:**aarch64** only. Due to fund limitation, we only tested the system to run on **Pi 4B 8Gb** running version **Debian GNU/Linux 11 (bullseye) 64bit**. 

Get the Pi **SDCard** located under it and attatch it to your computer and you can install it using **Raspberry Pi Imager**

## Installation

The following are **linux commands** used to install PHS. 

> **NOTE** : If installation of these dependencies/packages fails, please google or contact the developers for help.

#### Installing git
```
sudo apt-get install git;
```

#### Cloning PHS Repo
```
git clone "https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine.git" ~/CAPSTONE-PHS-Machine;
```

#### Copying the environment variables
```
cp .env.local ~/CAPSTONE-PHS-Machine/phsmachine_web;
```

#### Enable i2c, Set i2c speed & enable i2c-rtc,ds3231
```
echo -e "[all]\ndtoverlay=i2c-rtc,ds3231\ndtparam=i2c_arm=on,i2c_arm_baudrate=1000000\ngpu_mem=128" | sudo tee -a /boot/config.txt
```

#### Enable Real Time Clock (RTC) DS3231 on boot
```
sudo apt-get --purge remove fake-hwclock
echo -e "i2c-dev\ni2c-bcm2708\nrtc-ds1307" | sudo tee -a /etc/modules
echo -e "echo ds1307 0x68 | sudo tee /sys/class/i2c-adapter/i2c-1/new_device" | sudo tee /etc/rc.local
sudo hwclock -s
```

#### Update Packages
```
sudo apt update;
sudo apt install -y curl;
```

#### Install Node Version Manager (NVM)
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash;
```

#### Install MongoDb
```
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -;
curl -s -L https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -;
echo "deb [ arch=arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list;
sudo apt update;
sudo apt install mongodb-org;
```

#### Enable MongoDb Service
```
sudo systemctl enable mongod;
sudo systemctl start mongod;
```

#### Install Miniforge Miniconda
```
sudo chmod +x "Miniforge3-Linux-aarch64.sh";
sh "Miniforge3-Linux-aarch64.sh";
```

#### Download Tensorflow
```
curl -L https://github.com/PINTO0309/Tensorflow-bin/releases/download/v2.8.0/tensorflow-2.8.0-cp38-none-linux_aarch64.whl -o tensorflow-2.8.0-cp38-none-linux_aarch64.whl;
```

After completing these commands. Reboot the Raspberry Pi.


#### Installation Continues

#### Install Conda with python version 3.8
```
conda install python=3.8
pip3 install -r "~/CAPSTONE-PHS-Machine/Pig-Stress-DP-Algorithm/requirements.txt"
```

#### Install tensorflow
```
pip3 install tensorflow-2.8.0-cp38-none-linux_aarch64.whl
```

#### Install Yolov5 Dependencies
```
pip3 install -r ~/CAPSTONE-PHS-Machine/Pig-Stress-DP-Algorithm/models/Yolov5/requirements.txt"
```

#### Install Node
```
nvm install node
```

Once Again, Reboot the Pi.


#### Configure the PHS web
```
npm --prefix "~/CAPSTONE-PHS-Machine/phsmachine_web" install "~/CAPSTONE-PHS-Machine/phsmachine_web"
npm --prefix "~/CAPSTONE-PHS-Machine/phsmachine_web" run build
sudo -u $SUDO_USER chmod +x "~/CAPSTONE-PHS-Machine/phsmachine_web/phs_web_runner.sh"
```


#### Configure the PHS manual page site
```
npm --prefix "~/CAPSTONE-PHS-Machine/phsmachine_docu" install "~/CAPSTONE-PHS-Machine/phsmachine_docu"
npm --prefix "~/CAPSTONE-PHS-Machine/phsmachine_docu" run build
sudo -u $SUDO_USER chmod +x "~/CAPSTONE-PHS-Machine/phsmachine_docu/phs_docu_runner.sh"
```

#### Create system services
```
sudo touch /lib/systemd/system/phs_fserver.service
sudo touch /lib/systemd/system/phs_web.service
sudo touch /lib/systemd/system/phs_docu.Service
sudo touch /lib/systemd/system/phs_system.service
```

#### Configure & Enable PHS File Service
```
echo "[Unit]" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "Description=Runs PHS File Server" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "After=mongod.service" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "[Service]" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "WorkingDirectory=/home/$USER/CAPSTONE-PHS-Machine/phsmachine_web/public/" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "ExecStart=/usr/bin/python fserver.py" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "User=$USER" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "[Install]" | sudo tee -a /lib/systemd/system/phs_fserver.service
echo "WantedBy=multi-user.target" | sudo tee -a /lib/systemd/system/phs_fserver.service
sudo systemctl enable phs_fserver.service
```


#### Configure & Enable PHS Web Service
```
echo "[Unit]" | sudo tee -a /lib/systemd/system/phs_web.service
echo "Description=Runs PHS Web Server" | sudo tee -a /lib/systemd/system/phs_web.service
echo "After=phs_fserver.service" | sudo tee -a /lib/systemd/system/phs_web.service
echo "" | sudo tee -a /lib/systemd/system/phs_web.service
echo "[Service]" | sudo tee -a /lib/systemd/system/phs_web.service
echo "WorkingDirectory=/home/$USER/CAPSTONE-PHS-Machine/phsmachine_web" | sudo tee -a /lib/systemd/system/phs_web.service
echo "ExecStart=/bin/bash phs_web_runner.sh" | sudo tee -a /lib/systemd/system/phs_web.service
echo "User=$USER" | sudo tee -a /lib/systemd/system/phs_web.service
echo "" | sudo tee -a /lib/systemd/system/phs_web.service
echo "[Install]" | sudo tee -a /lib/systemd/system/phs_web.service
echo "WantedBy=multi-user.target" | sudo tee -a /lib/systemd/system/phs_web.service
sudo systemctl enable phs_web.service
```

#### Configure & Enable PHS Manual Site Service
```
echo "[Unit]" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "Description=Runs PHS Docu Site" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "After=mongod.service" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "[Service]" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "WorkingDirectory=/home/$USER/CAPSTONE-PHS-Machine/phsmachine_docu" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "ExecStart=/bin/bash phs_web_runner.sh" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "User=$USER" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "[Install]" | sudo tee -a /lib/systemd/system/phs_docu.service
echo "WantedBy=multi-user.target" | sudo tee -a /lib/systemd/system/phs_docu.service
sudo systemctl enable phs_docu.Service
```

#### Configure & Enable PHS Detection System Service
```
echo "[Unit]" | sudo tee -a /lib/systemd/system/phs_system.service
echo "Description=Runs PHS Python Detect Server" | sudo tee -a /lib/systemd/system/phs_system.service
echo "After=phs_web.service" | sudo tee -a /lib/systemd/system/phs_system.service
echo "" | sudo tee -a /lib/systemd/system/phs_system.service
echo "[Service]" | sudo tee -a /lib/systemd/system/phs_system.service
echo "WorkingDirectory=/home/$USER/CAPSTONE-PHS-Machine/Pig-Stress-DP-Algorithm" | sudo tee -a /lib/systemd/system/phs_system.service
echo "ExecStart=/bin/bash phs_system_runner.sh" | sudo tee -a /lib/systemd/system/phs_system.service
echo "User=$USER" | sudo tee -a /lib/systemd/system/phs_system.service
echo "" | sudo tee -a /lib/systemd/system/phs_system.service
echo "[Install]" | sudo tee -a /lib/systemd/system/phs_system.service
echo "WantedBy=multi-user.target" | sudo tee -a /lib/systemd/system/phs_system.service
sudo systemctl enable phs_system.service
```

Once again, restart the system. Now access the system, you can read & follow the instruction at the link below.
* [PHS Accessing & Authentication](_page_access_auth?id=accessing-phs)