ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-bullseye-slim as build

LABEL monaka.version="1.0.0"

ARG UID=1001
ARG GID=1001
ARG USERNAME=monakadev
ARG USERGROUP=${USERNAME}

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
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9

RUN groupadd -g ${GID} ${USERGROUP} \
    && useradd -u ${UID} -g ${USERGROUP} -m -s /bin/bash ${USERNAME}
ENV HOME=/home/${USERNAME}

USER ${USER_NAME}
WORKDIR ${HOME}/monaka/src
COPY --chown=${USER_NAME}:${USER_GROUP} ./src ./
RUN npm install

# CMD ["dumb-init", "node", "app.js"]
CMD ["dumb-init", "node", "--watch", "app.js"]

FROM build AS development
