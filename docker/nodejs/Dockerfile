FROM node:20.13.1-bullseye-slim as base

RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends dumb-init

RUN npm i -g npm

RUN useradd --user-group --create-home --shell /bin/bash monakadev
ENV HOME=/home/monakadev

COPY ./src $HOME/monaka/src
RUN chown -R monakadev:monakadev $HOME/*

USER monakadev
WORKDIR $HOME/monaka/src
RUN npm install

CMD ["dumb-init", "node", "--watch", "app.js"]

FROM base AS local
USER root
RUN apt-get install -y --no-install-recommends \
  libxtst6 libdbus-glib-1-2 libx11-xcb1 \
  libgtk-3.0 libgbm-dev libnss3 libatk-bridge2.0-0 libasound2 \
  libgstreamer1.0-0 libegl1 libevent-2.1-7 libopus0 libxslt1.1 \
  libopengl0 libglx0 libwoff1 libharfbuzz-icu0 libgstreamer-plugins-base1.0-0 \
  libgstreamer-gl1.0-0 libopenjp2-7 libwebpdemux2 libenchant-2-2 libsecret-1-0 \
  libhyphen0 libmanette-0.2-0 libatomic1 libgles2 gstreamer1.0-libav

USER monakadev
WORKDIR $HOME/monaka/src
RUN npm i -D @playwright/test \
  && npx playwright install
