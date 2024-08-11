ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-bullseye-slim AS build

LABEL monaka.version="1.0.0"

ARG USER_NAME=node
ARG USER_GROUP=${USER_NAME}

RUN apt update \
  && apt upgrade -y \
  && apt install -y --no-install-recommends \
  dumb-init \
  locales \
  git \
  && apt clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm i -g npm

RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV TZ=JST-9

USER ${USER_NAME}

# copy
WORKDIR /workspaces/monaka
COPY --chown=${USER_NAME}:${USER_GROUP} ./ ./

# insall
WORKDIR /workspaces/monaka/src
RUN npm install

# CMD ["dumb-init", "node", "app.js"]
CMD ["dumb-init", "node", "--watch", "app.js"]

FROM build AS development
