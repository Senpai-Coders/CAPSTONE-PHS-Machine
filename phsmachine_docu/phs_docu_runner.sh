#! /bin/bash
clear
. ~/.nvm/nvm.sh
. ~/.bashrc

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_PHS_DOCU_DIR_="$_EXPECTED_DIR/phsmachine_docu/"

export NODE_ENV=development

npm --prefix "$_PHS_DOCU_DIR_" run start