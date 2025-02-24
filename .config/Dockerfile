FROM alpine

RUN apk add nodejs npm chromium 

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci

COPY . /app

CMD ["node", "index.js", "admin"]
