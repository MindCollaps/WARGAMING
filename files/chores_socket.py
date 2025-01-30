import socket
import os
import re
import subprocess

def clean_tmp():
    subprocess.run(["rm", "-rf", "/tmp/*"])

def execute_command(user_input):
    cmd_pattern = r'^(\w+)(?:\s+(.*))?$'
    match = re.match(cmd_pattern, user_input)
    
    if not match:
        return "Invalid command format"
    
    cmd, args = match.groups()
    args = args.split() if args else []

    allowed_commands = ['clean_tmp', 'list_tmp', 'cow']
    if cmd.lower() not in [c.lower() for c in allowed_commands]:
        return "Command not allowed"
    
    if cmd.lower() == 'clean_tmp':
        return subprocess.run(f"rm -rf /tmp/{' '.join(args)}", shell=True, capture_output=True, text=True).stdout
    elif cmd.lower() == 'list_tmp':
        return subprocess.run(f"ls -l /tmp/{' '.join(args)}", shell=True, capture_output=True, text=True).stdout
    elif cmd.lower() == 'cow':
        sanitized_args = ' '.join([arg.replace(';', '').replace('&', '') for arg in args])
        return subprocess.run(f"/usr/games/cowsay {sanitized_args}", shell=True, capture_output=True, text=True).stdout
    else:
        return "Unknown error occurred"

if os.path.exists("/var/run/chores_socket"):
    os.remove("/var/run/chores_socket")

server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
server.bind("/var/run/chores_socket")
os.chmod("/var/run/chores_socket", 0o777)

print("Chores service started. Waiting for commands...")

while True:
    server.listen(1)
    conn, addr = server.accept()
    command = conn.recv(1024).decode('utf-8').strip()
    
    if command:
        print(f"Received command: {command}")
        result = execute_command(command)
        conn.sendall(result.encode('utf-8'))
    
    conn.close()
