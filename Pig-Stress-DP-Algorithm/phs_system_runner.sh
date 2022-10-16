clear
. ~/.bashrc
. ~/.condarc

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_SYSTEM_DIR_="$_EXPECTED_DIR/Pig-Stress-DP-Algorithm"
_EXPECTED_MINIFORGE_="/home/$USER/miniforge3/bin/python"

if [ -d "$_EXPECTED_DIR" ]; then
  echo ""
else
    echo "PHS not installed, try running Installer-A.sh again.."
    exit 0
fi

if [ -d "$_EXPECTED_MINIFORGE_" ]; then
  echo ""
else
    echo "Miniforge not installed or $_EXPECTED_MINIFORGE_ can't be located,  try running Installer-A.sh again.."
    exit 0
fi

/home/$USER/miniforge3/bin/python "$_SYSTEM_DIR_/app.py"