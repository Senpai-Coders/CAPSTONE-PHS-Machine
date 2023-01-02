clear
. ~/.bashrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_PHS_WEB_DIR_="$_EXPECTED_DIR/phsmachine_web"

echo -e "Checking PHS build\n"
filename="$_PHS_WEB_DIR_/lastipbuild.tmp"
n=1

curip=$(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')

# ip_len=${#curip}

# while [ $ip_len -lt 1 ]
# do
#    echo "no ip yet, loading.."
#    curip=$(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')
# done
# echo "Got an IP : $curip"

lastbuild='-'

while read line; do
    # reading each line
    lastbuild="$line"
    n=$((n + 1))
done <$filename

echo "lastbuild :-> $lastbuild"
echo -e "current_ip :-> $curip \n"

max_rerun=5
rerun_count=0

build_phs() {
    echo "building PHS"
    npm install --prefix "$_PHS_WEB_DIR_"
    npm --prefix "$_PHS_WEB_DIR_" run build
    echo "$curip" | tee "$_PHS_WEB_DIR_/lastipbuild.tmp"
}

run_phs() {
    npm --prefix "$_PHS_WEB_DIR_" run start
    if [ $? -eq 1 ]; then
        rerun_count=$(($rerun_count+1))
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

sleep 1
if [ "$lastbuild" != "$curip" ]; then
    echo "**need rebuild**"
    build_phs
else
    echo "**no need for rebuild**"
fi

# npm --prefix "$_PHS_WEB_DIR_" run build
run_phs
echo "we tried $max_rerun times but the system won't start"