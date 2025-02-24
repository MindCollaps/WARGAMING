FROM alpine:3.19.0

RUN apk add nodejs npm chromium 

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install

COPY . /app

CMD ["node", "index.js", "admin"]
