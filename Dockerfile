FROM ubuntu:25.04

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY box_setup.sh box_setup.sh

RUN bash box_setup.sh

RUN npm install

COPY . .

CMD [ "node", "index.js" ]

EXPOSE 5000