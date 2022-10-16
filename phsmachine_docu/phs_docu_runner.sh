clear
. ~/.bashrc
. ~/.config/nvm/nvm.sh

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_PHS_DOCU_DIR_="$_EXPECTED_DIR/phsmachine_docu/"

sleep 10

$NPMDIRECT=which npm

npm --prefix "$_PHS_DOCU_DIR_" run serve