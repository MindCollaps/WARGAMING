#!/bin/sh

sudo docker build -t ctf ./ && sudo docker run -d -p 5000:5000 --rm --name ctf ctf