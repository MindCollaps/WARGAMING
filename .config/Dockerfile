FROM alpine:3.19.0

RUN --mount=type=cache,target=/var/cache/apk \
    apk add nodejs npm chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY . /app
RUN --mount=type=cache,target=/root/.npm \
    npm ci

CMD ["node", "index.js", "admin"]