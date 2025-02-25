#!/bin/sh

chmod 777 /app/db -R
chown ubuntu:ubuntu /app/db -R

service chores start
exec su -c "node /app/index.js" -s /bin/sh ubuntu