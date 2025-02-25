FROM alpine:3.19.0

RUN --mount=type=cache,target=/var/cache/apk \
    apk add nodejs npm chromium wget

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY . /app
RUN --mount=type=cache,target=/root/.npm \
    npm install

RUN wget -O ./public/vue.js https://unpkg.com/vue@3/dist/vue.global.js

CMD ["node", "index.js", "admin"]