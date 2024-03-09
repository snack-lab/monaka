FROM node:20.11.1-bullseye-slim

RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y --no-install-recommends dumb-init \
 wget

 # ENV NODE_NEV production
ENV NODE_NEV development

RUN npm i -g npm

RUN useradd --user-group --create-home --shell /bin/bash monakadev
ENV HOME=/home/monakadev

COPY ./src $HOME/monaka/src
RUN chown -R monakadev:monakadev $HOME/*

USER monakadev
WORKDIR $HOME/monaka/src
RUN npm install

CMD ["dumb-init", "node", "app.js"]
