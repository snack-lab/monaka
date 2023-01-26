FROM node:19.5.0-bullseye-slim

RUN apt-get update \
 && apt-get install -y wget

RUN useradd --user-group --create-home --shell /bin/bash monakadev
ENV HOME=/home/monakadev

COPY ./src $HOME/monaka/src
RUN chown -R monakadev:monakadev $HOME/*

USER monakadev
WORKDIR $HOME/monaka/src
RUN npm install

