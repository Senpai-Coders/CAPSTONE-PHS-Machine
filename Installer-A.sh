#!/bin/sh
clear
echo "NOTE: IF ANY ERROR OCCURS PLEASE EMAIL jsparagas1@student.fatima.edu.ph with the screenshot of the error\n\n"

echo "*** Welcome to PHS INSTALLER Part A ***\n\n"
echo "We're about to install/download the following\n"
sleep 1
echo "-Dependency Technologies\n -MongoDb \n -Node \n -MiniConda \n -Git\n"
sleep 1
echo "-ADVANCE\n -Set i2c speed to 1mhz\n\nDownload PHS Files\n -PHS repository\n\n"

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_CURDIR_="$( cd "$( dirname "$0" )" && pwd )"
_PHS_REPO_="https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine.git"

sleep 1

read -p "PROCEED INSTALLATION? [y/n] : " _USR_INPUT_ 
if [ "$_USR_INPUT_" = "n" ]; then
  echo "\n\nInstallation Cancelled"
  exit 0
fi

if [ -d "$_EXPECTED_DIR" ]; then
  echo "\n\nPHS Already exists.. Proceeding...\n\n"
else
    sudo -u $USER apt-get install git
    echo "Downloading PHS...\n"
    git clone "https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine.git" "$_EXPECTED_DIR"
    echo "Done downloading PHS...\n\n"
fi

#Set i2c baudrate to 1mhz
sudo -u $USER echo "i2c_arm_baudrate=1000000" >> "/boot/config.txt"

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo -u $USER apt-key add -
curl -s -L https://www.mongodb.org/static/pgp/server-4.4.asc | sudo -u $USER apt-key add -
echo "deb [ arch=arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo -u $USER tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo -u $USER apt update
sudo -u $USER apt install mongodb-org
sudo -u $USER systemctl enable mongod
sudo -u $USER systemctl start mongod

# INSTALL MINIFORGE
clear;
echo "Installing Miniforge (Mini Conda)"
sleep 1
sudo -u $USER chmod +x "$_CURDIR_/Installers/Miniforge3-Linux-aarch64.sh"
sh "$_CURDIR_/Installers/Miniforge3-Linux-aarch64.sh"

# CREATING CONDA ENVIRONMENT
echo "Creating Conda Environment"
sleep 1
conda create -y --name pig-stress-env python=3.8 pip
conda activate pig-stress-env
conda info

echo "please RESTART to apply changes & run Installer-B.sh to complete PHS Installation"