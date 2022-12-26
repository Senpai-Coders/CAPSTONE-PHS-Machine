clear
. ~/.bashrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

_EXPECTED_DIR="/home/$USER/CAPSTONE-PHS-Machine"
_PHS_WEB_DIR_="$_EXPECTED_DIR/phsmachine_web"

echo -e "Checking PHS build\n"
filename="$_PHS_WEB_DIR_/lastipbuild.tmp"
n=1

curip=$(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')

ip_len=${#curip}

while [ $ip_len -lt 1 ]
do
   echo "no ip yet, loading.."
   curip = $(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')
done
echo "Got an IP : $curip"

lastbuild='-'

while read line; do
# reading each line
    lastbuild="$line"
    n=$((n+1))
done < $filename

echo "lastbuild :-> $lastbuild"
echo -e "current_ip :-> $curip \n"

sleep 1
if [ "$lastbuild" != "$curip" ]; then
    echo "**need rebuild**"
    echo "rebuilding PHS"
    npm --prefix "$_PHS_WEB_DIR_" run build
    echo "$curip" | tee "$_PHS_WEB_DIR_/lastipbuild.tmp"
else
    echo "**no need for rebuild**"
fi

if [ ! -d "$_PHS_WEB_DIR_/.next" ]; then
    echo "**Build missing, rebuilding web**"
    npm --prefix "$_PHS_WEB_DIR_" run build
    echo "$curip" | tee "$_PHS_WEB_DIR_/lastipbuild.tmp"
fi

# npm --prefix "$_PHS_WEB_DIR_" run build
npm --prefix "$_PHS_WEB_DIR_" run start