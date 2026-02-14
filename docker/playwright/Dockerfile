# syntax=docker/dockerfile:1

ARG PLAYWRIGHT_VERSION=v1.58.2

FROM mcr.microsoft.com/playwright:${PLAYWRIGHT_VERSION}-noble

RUN --mount=type=cache,id=monaka_apt_cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,id=monaka_apt_lib,target=/var/lib/apt,sharing=locked \
  apt-get -qq update \
  && apt-get -qq install -y --no-install-recommends \
  locales \
  && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8

# locale
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV TZ=JST-9

WORKDIR /home/pwuser
USER pwuser
RUN npx playwright install

CMD ["npx", "-y", "playwright@1.58.2", "run-server", "--port", "3000", "--host", "0.0.0.0"]
