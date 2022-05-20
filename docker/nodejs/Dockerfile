FROM node:18.2.0-slim

RUN apt-get update

RUN useradd --user-group --create-home --shell /bin/bash monakadev
ENV HOME=/home/monakadev

COPY ./src $HOME/monaka/src
RUN chown -R monakadev:monakadev $HOME/*

USER monakadev
WORKDIR $HOME/monaka/src
RUN npm install

