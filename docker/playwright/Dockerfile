# syntax=docker/dockerfile:1

ARG PLAYWRIGHT_VERSION=v1.61.1

FROM mcr.microsoft.com/playwright:${PLAYWRIGHT_VERSION}-noble

RUN rm -f /etc/apt/apt.conf.d/docker-clean; \
  echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache

RUN --mount=type=cache,id=monaka_apt_cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,id=monaka_apt_lib,target=/var/lib/apt,sharing=locked \
  apt-get -qq update \
  && apt-get -qq install -y --no-install-recommends \
  locales > /dev/null

# locale
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG=ja_JP.UTF-8 \
  LANGUAGE=ja_JP:ja \
  LC_ALL=ja_JP.UTF-8 \
  TZ=Asia/Tokyo

WORKDIR /home/pwuser
USER pwuser
RUN npx playwright install

CMD ["npx", "-y", "playwright@1.61.1", "run-server", "--port", "3000", "--host", "0.0.0.0"]
