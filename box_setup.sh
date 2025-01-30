echo setting up box...

mv ./group /etc
mv ./files/chores_socket.py /usr/local/sbin/
mkdir -p /etc/init.d
mv ./files/chores /etc/init.d/
chmod +x /etc/init.d/chores