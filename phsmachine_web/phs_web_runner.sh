clear
. ~/.bashrc

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_PHS_WEB_DIR_="$_EXPECTED_DIR/phsmachine_web/"

npm --prefix "$_PHS_WEB_DIR_" run start