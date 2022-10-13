#!/bin/bash
clear
echo "NOTE: IF ANY ERROR OCCURS PLEASE EMAIL jsparagas1@student.fatima.edu.ph with the screenshot of the error\n\n"

echo "*** Welcome to PHS INSTALLER Part C ***\n\n"
echo "We're about to do the following\n"

echo "*Build web & install dependencies"
echo "*Install systemd services"

sleep 2

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_CURDIR_="$( cd "$( dirname "$0" )" && pwd )"
_PHS_REPO_="https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine.git"

if [ -d "$_EXPECTED_DIR" ]; then
  echo ""
else
    echo "PHS not installed, try running Installer-A.sh again.."
    exit 0
fi

sleep 1

read -p "PROCEED INSTALLATION? [y/n] : " _USR_INPUT_ 
if [ "$_USR_INPUT_" = "n" ]; then
  echo "\n\nInstallation Cancelled"
  exit 0
fi
