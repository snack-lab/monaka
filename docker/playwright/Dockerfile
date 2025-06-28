ARG PLAYWRIGHT_VERSION=v1.53.1

FROM mcr.microsoft.com/playwright:${PLAYWRIGHT_VERSION}-noble

RUN apt update \
  && apt upgrade -y \
  && apt install -y --no-install-recommends \
  locales \
  && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

# locale
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV TZ=JST-9

WORKDIR /home/pwuser
USER pwuser
RUN npx playwright install

CMD ["npx", "-y", "playwright@1.53.1", "run-server", "--port", "3000", "--host", "0.0.0.0"]
