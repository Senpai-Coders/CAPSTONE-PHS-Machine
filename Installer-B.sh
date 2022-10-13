#!/bin/bash
clear
echo "NOTE: IF ANY ERROR OCCURS PLEASE EMAIL jsparagas1@student.fatima.edu.ph with the screenshot of the error"

echo "*** Welcome to PHS INSTALLER Part B ***"
echo "We're about to install Node\n"

sleep 2

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_CURDIR_="$( cd "$( dirname "$0" )" && pwd )"
_PHS_REPO_="https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine.git"

sleep 1

if [ -d "$_EXPECTED_DIR" ]; then
  echo ""
else
    echo "PHS not installed, try running Installer-A.sh again.."
    exit 0
fi

read -p "PROCEED INSTALLATION? [y/n] : " _USR_INPUT_ 
if [ "$_USR_INPUT_" = "n" ]; then
  echo "\n\nInstallation Cancelled"
  exit 0
fi

conda install python=3.8
conda info
nvm install node

node -v
npm --v

echo "Installation Completed, Please exit the current shell & open a new one then proceed to Installer-C.sh"