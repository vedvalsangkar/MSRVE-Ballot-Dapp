IP=`exec ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`
echo 'var serverIP = "'$IP'"' > js/ip.js
echo '{"serverIP" : "'$IP'"}' > ip.json

