FROM ubuntu:25.04

WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get update

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get -y --no-install-recommends install \
        nodejs npm python3 socat cowsay

COPY . .

RUN bash ./box_setup.sh

RUN --mount=type=cache,target=/root/.npm \
    npm install

RUN chmod +x ./docker_start.sh

CMD [ "./docker_start.sh" ]

EXPOSE 5000