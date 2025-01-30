#!/bin/sh

#!/bin/bash

hide_flag() {
    local challenge_name="$1"
    local destination="$2"
    local owner="$3"
    local csv_path="flags.csv"

    if [ ! -f "$csv_path" ]; then
        echo "Error: CSV file not found: $csv_path"
        return 1
    fi

    flag=$(awk -F'\t' -v name="$challenge_name" '$1 == name {print $8}' "$csv_path")

    if [ -z "$flag" ]; then
        echo "Error: Challenge name not found in CSV"
        return 1
    fi

    if ! id "$owner" &>/dev/null; then
        echo "Error: Owner does not exist: $owner"
        return 1
    fi

    echo "$flag" > "$destination"
    chmod 600 "$destination"

    chown "$owner:$owner" "$destination"

    echo "Flag hidden successfully at $destination"
    return 0
}


echo setting up box...

mv ./group /etc
mv ./files/chores_socket.py /usr/local/sbin/
mkdir -p /etc/init.d
mv ./files/chores /etc/init.d/
chmod +x /etc/init.d/chores

chown root:root ./docker_start.sh
chmod 700 ./docker_start.sh

# Challange setup
hide_flag "Root user" "/root/flag.txt" "root"


# Cronjob
mkdir -p /var/spool/cron/crontabs
echo "*/5 * * * * echo 'clean_tmp' | nc -U /var/run/chores_socket" > "/var/spool/cron/crontabs/ubuntu"
chown ubuntu:ubuntu /var/spool/cron/crontabs/ubuntu
chmod 700 /var/spool/cron/crontabs/ubuntu

 # Cleanup
rm ./flags.csv
rm ./group
rm ./start_ctf.sh
rm -rf ./files

rm ./box_setup.sh