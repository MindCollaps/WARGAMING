#!/bin/sh

service chores start
exec su -c "node /app/index.js" -s /bin/sh ubuntu