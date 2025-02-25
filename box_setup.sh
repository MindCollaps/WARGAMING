#!/bin/sh

#!/bin/bash

echo setting up box...

mv ./files/chores_socket.py /usr/local/sbin/
mkdir -p /etc/init.d
mv ./files/chores /etc/init.d/
chmod +x /etc/init.d/chores

chown root:root ./docker_start.sh
chmod 700 ./docker_start.sh

# Cronjob
mkdir -p /var/spool/cron/crontabs
echo "*/5 * * * * echo 'clean_tmp' | nc -U /var/run/chores_socket" > "/var/spool/cron/crontabs/ubuntu"
chown ubuntu:ubuntu /var/spool/cron/crontabs/ubuntu
chmod 700 /var/spool/cron/crontabs/ubuntu

 # Cleanup
rm ./start_ctf.sh
rm -rf ./files

rm ./box_setup.sh