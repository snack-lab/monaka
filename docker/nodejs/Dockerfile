# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

# node build stage
FROM node:${NODE_VERSION}-trixie-slim AS build
WORKDIR /app
RUN --mount=type=cache,id=cs_app_node,target=/tmp/.npm \
  npm_config_cache=/tmp/.npm \
  npm i -g --no-audit --progress=false npm opencode-ai
COPY ./src/package.json ./src/package-lock.json ./
RUN --mount=type=cache,id=monaka_npm,target=/tmp/npm \
  npm_config_cache=/tmp/npm \
  npm i --no-audit --progress=false \
  && npm cache clean --force

# development
FROM node:${NODE_VERSION}-trixie-slim AS development
COPY --from=build --link /usr/local/lib/node_modules /usr/local/lib/node_modules

LABEL monaka.version="1.0.0"

ARG USER_NAME=node
ARG USER_GROUP=${USER_NAME}

RUN rm -f /etc/apt/apt.conf.d/docker-clean; \
  echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache

RUN --mount=type=cache,id=monaka_apt_cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,id=monaka_apt_lib,target=/var/lib/apt,sharing=locked \
  apt-get -qq update > /dev/null \
  && apt-get -qq install -y --no-install-recommends \
  dumb-init \
  locales \
  git > /dev/null

# locale
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG=ja_JP.UTF-8 \
  LANGUAGE=ja_JP:ja \
  LC_ALL=ja_JP.UTF-8 \
  TZ=Asia/Tokyo

# create user
USER ${USER_NAME}
ENV HOME=/home/${USER_NAME}
WORKDIR /workspaces/monaka/src

# copy src
COPY --chown=${USER_NAME}:${USER_GROUP} ./src ./
COPY --from=build --chown=${USER_NAME}:${USER_GROUP} /app/node_modules ./node_modules

# CMD ["dumb-init", "node", "app.js"]
CMD ["dumb-init", "node", "--watch", "app.js"]
