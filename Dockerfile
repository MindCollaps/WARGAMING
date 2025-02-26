FROM ubuntu:25.04

WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get update

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get -y --no-install-recommends install \
        nodejs npm python3 socat cowsay imagemagick cron netcat-openbsd wget


COPY --chown=ubuntu:ubuntu . .

RUN wget -O ./public/vue.js https://unpkg.com/vue@3/dist/vue.global.js

RUN chown ubuntu:ubuntu /app -R

RUN bash ./box_setup.sh

RUN --mount=type=cache,target=/usr/share/node_modules \
    npm install

RUN chmod +x /app/docker_start.sh

CMD [ "/app/docker_start.sh" ]

EXPOSE 5000