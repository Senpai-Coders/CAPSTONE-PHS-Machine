#! /bin/bash
clear
. ~/.nvm/nvm.sh
. ~/.bashrc

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_SYSTEM_DIR_="$_EXPECTED_DIR/Pig-Stress-DP-Algorithm"

if [ -d "$_EXPECTED_DIR" ]; then
  echo ""
else
    echo "PHS not installed, try running Installer-A.sh again.."
    exit 0
fi

python "$_SYSTEM_DIR_/app.py"