FROM ubuntu:25.04

WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get update

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get -y --no-install-recommends install \
        nodejs npm python3 socat cowsay imagemagick cron netcat-openbsd

RUN chown ubuntu:ubuntu /app

COPY --chown=ubuntu:ubuntu . .

RUN bash ./box_setup.sh

USER ubuntu

RUN --mount=type=cache,target=/ubuntu/.npm \
    npm install

USER root

RUN chmod +x ./docker_start.sh

CMD [ "./docker_start.sh" ]

EXPOSE 5000