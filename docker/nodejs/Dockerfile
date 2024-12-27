ARG NODE_VERSION=22
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
  && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 \
  && apt clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm i -g npm

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
RUN npm install

# CMD ["dumb-init", "node", "app.js"]
CMD ["dumb-init", "node", "--watch", "app.js"]

FROM build AS development
