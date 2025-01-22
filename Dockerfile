FROM node:latest

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN bash box_setup.sh

CMD [ "node", "index.js" ]

EXPOSE 5000