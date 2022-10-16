clear
. ~/.bashrc
. ~/.config/nvm/nvm.sh

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_PHS_DOCU_DIR_="$_EXPECTED_DIR/phsmachine_docu/"

cd "$_PHS_DOCU_DIR_/docs"
pwd

python3 -m http.server 3001