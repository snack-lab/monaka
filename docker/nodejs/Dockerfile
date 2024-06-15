ARG NODE_VERSION=20.14.0
FROM node:${NODE_VERSION}-bullseye-slim as build

LABEL monaka.version="1.0.0"

ENV USER_NAME=monakadev
ENV USER_GROUP=monakadev

RUN apt update \
  && apt upgrade -y \
  && apt install -y --no-install-recommends \
     dumb-init \
     locales \
  && apt clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm i -g npm

RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9

RUN useradd --user-group --create-home --shell /bin/bash ${USER_NAME}
ENV HOME=/home/${USER_NAME}

USER ${USER_NAME}
WORKDIR ${HOME}/monaka/src
COPY --chown=${USER_NAME}:${USER_GROUP} ./src ./
RUN npm install

# CMD ["dumb-init", "node", "app.js"]
CMD ["dumb-init", "node", "--watch", "app.js"]

FROM build AS devlop
