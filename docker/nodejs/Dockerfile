ARG NODE_VERSION=22

# build
FROM node:${NODE_VERSION}-bullseye-slim AS build
WORKDIR /app
RUN npm i -g npm
COPY ./src/package.json ./src/package-lock.json ./
RUN npm i --no-progress

# development
FROM node:${NODE_VERSION}-bullseye-slim AS development
COPY --from=build /usr/local/bin/ /usr/local/bin/
COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules

LABEL monaka.version="1.0.0"

ARG USER_NAME=node
ARG USER_GROUP=${USER_NAME}

RUN apt update \
  && apt upgrade -y \
  && apt install -y --no-install-recommends \
  dumb-init \
  locales \
  git \
  && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

# locale
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV TZ=JST-9

# user
USER ${USER_NAME}
ENV HOME=/home/${USER_NAME}
WORKDIR /workspaces/monaka/src

# copy src
COPY --chown=${USER_NAME}:${USER_GROUP} ./src ./
COPY --from=build --chown=${USER_NAME}:${USER_GROUP} /app/node_modules ./node_modules

# CMD ["dumb-init", "node", "app.js"]
CMD ["dumb-init", "node", "--watch", "app.js"]
