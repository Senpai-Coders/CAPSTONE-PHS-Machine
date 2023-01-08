clear
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

#git tracking info
UPSTREAM=${1:-'@{u}'}
LOCAL=$(git -C "$_PHS_WEB_DIR_" rev-parse @)
REMOTE=$(git -C "$_PHS_WEB_DIR_" rev-parse "$UPSTREAM")
BASE=$(git -C "$_PHS_WEB_DIR_" merge-base @ "$UPSTREAM")

#read nung mga tracking files
lastbuild=$(cat $_PHS_WEB_DIR_/tracking_lastipbuild.tmp)
toupdate=$(cat $_PHS_WEB_DIR_/tracking_shouldupdate.tmp)

curip=$(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')
forcebuild="false"

n=1

# ip_len=${#curip}
# while [ $ip_len -lt 1 ]
# do
#    echo "no ip yet, loading.."
#    curip=$(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')
# done
# echo "Got an IP : $curip"

max_rerun=5   #max reattempt to run
rerun_count=0 #rerun count

fetch_phs() {
    git -C "$_PHS_WEB_DIR_" fetch

    UPSTREAM=${1:-'@{u}'}
    LOCAL=$(git -C "$_PHS_WEB_DIR_" rev-parse @)
    REMOTE=$(git -C "$_PHS_WEB_DIR_" rev-parse "$UPSTREAM")
    BASE=$(git -C "$_PHS_WEB_DIR_" merge-base @ "$UPSTREAM")

    echo "Remote Version : $REMOTE"
    echo "Local Version : $LOCAL"
    echo "Base Version : $BASE"

    if [ $LOCAL = $REMOTE ]; then
        echo "\nPHS is Up-to-date"
        echo "-" >"$_PHS_WEB_DIR_/tracking_hasupdate.tmp"
    elif [ $LOCAL = $BASE ]; then
        echo "\nPHS Has New Update -> $REMOTE"
        echo $(git rev-list --format=%B --max-count=1 "$REMOTE") >"$_PHS_WEB_DIR_/tracking_hasupdate.tmp"
    fi
}

update_phs() {
    if [ $LOCAL = $REMOTE ]; then
        echo "lol system doesn't have latest update from remote"
        echo "false" >"$_PHS_WEB_DIR_/tracking_shouldupdate.tmp"
        return 0
    fi

    echo "\nUpdating PHS"
    git -C "$_PHS_WEB_DIR_" reset --hard
    git -C "$_PHS_WEB_DIR_" pull
    echo "false" >"$_PHS_WEB_DIR_/tracking_shouldupdate.tmp"
    forcebuild="true"
}

build_phs() {
    echo "building PHS"
    npm install --prefix "$_PHS_WEB_DIR_"
    npm --prefix "$_PHS_WEB_DIR_" run build
    echo "$curip" | tee "$_PHS_WEB_DIR_/tracking_lastipbuild.tmp"
}

# update the system if requested by user
if [ "$toupdate" = "true" ]; then
    echo "**Updating System**"
    echo -e "GET http://google.com HTTP/1.0\n\n" | nc google.com 80 >/dev/null 2>&1

    if [ $? -eq 0 ]; then
        update_phs
    else
        echo "Offline - Won't Update"
    fi

    sleep 1
fi

run_phs() {
    npm --prefix "$_PHS_WEB_DIR_" run start
    if [ $? -eq 1 ]; then
        rerun_count=$(($rerun_count + 1))
        echo ""
        echo ""
        echo "FAILED TO RUN, retrying -> $rerun_count : max retry -> $max_rerun"
        sleep 1
        if [ $rerun_count -lt $max_rerun ]; then
            build_phs
            run_phs
        fi
    fi
}

echo "\n**Checking PHS build**"
echo "lastbuild -> $lastbuild"
echo "current_ip -> $curip \n"
sleep 1
if [ "$lastbuild" != "$curip" ]; then
    echo "**need rebuild**"
    build_phs
else
    echo "**no need for rebuild**\n"
fi

echo "**Checking PHS update from remote**"
fetch_phs

# npm --prefix "$_PHS_WEB_DIR_" run build
run_phs
echo "we tried $max_rerun times but the system won't start"
