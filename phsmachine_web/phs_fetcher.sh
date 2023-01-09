#load mga bash configs/scripts
. ~/.bashrc

#nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

#path ng system
_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_PHS_WEB_DIR_="$_EXPECTED_DIR/phsmachine_web"

#initializes mga tracking files
touch "$_PHS_WEB_DIR_/tracking_shouldupdate.tmp"
touch "$_PHS_WEB_DIR_/tracking_lastipbuild.tmp"
touch "$_PHS_WEB_DIR_/tracking_hasupdate.tmp"

#Initialize variables
curip=$(hostname -I) 
forcebuild="false"
hasupdate="false"
n=1

#exit if ip is not fully set 
if [ `expr length "$curip"` -eq 0 ]; then
	exit 1
fi

#git tracking info
UPSTREAM=${1:-'@{u}'}
LOCAL=$(git -C "$_PHS_WEB_DIR_" rev-parse @)
REMOTE=$(git -C "$_PHS_WEB_DIR_" rev-parse "$UPSTREAM")
BASE=$(git -C "$_PHS_WEB_DIR_" merge-base @ "$UPSTREAM")

#read nung mga tracking files
lastbuild=$(cat $_PHS_WEB_DIR_/tracking_lastipbuild.tmp)
toupdate=$(cat $_PHS_WEB_DIR_/tracking_shouldupdate.tmp)

max_rerun=5   #max reattempt to run
rerun_count=0 #rerun count
retry_update_count=0

fetch_phs() {
    echo "**Chcking for updates**"
    git -C "$_PHS_WEB_DIR_" fetch

    UPSTREAM=${1:-'@{u}'}
    LOCAL=$(git -C "$_PHS_WEB_DIR_" rev-parse @)
    REMOTE=$(git -C "$_PHS_WEB_DIR_" rev-parse "$UPSTREAM")
    BASE=$(git -C "$_PHS_WEB_DIR_" merge-base @ "$UPSTREAM")

    echo "Remote Version : $REMOTE"
    echo "Local Version : $LOCAL"
    echo "Base Version : $BASE"

    if [ $LOCAL = $REMOTE ]; then
        echo -e "\nPHS is Up-to-date"
        echo "-" >"$_PHS_WEB_DIR_/tracking_hasupdate.tmp"
        hasupdate="false"
    elif [ $LOCAL = $BASE ]; then
        echo -e "\nPHS Has New Update -> $REMOTE"
        echo $(git rev-list --format=%B --max-count=1 "$REMOTE") >"$_PHS_WEB_DIR_/tracking_hasupdate.tmp"
        hasupdate="true"
    fi
}

fetch_phs