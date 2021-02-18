FROM node:14.15.4-alpine
ENV API_DIR=/opt/gobarber-backend/

USER root

WORKDIR $API_DIR

COPY ["package.json", "package-lock.json*", "/home/gobarber/api/"]

RUN apk add --no-cache --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp@7.1.2 -g && \
  npm install --production --silent && mv node_modules ../ && \
  # npm ci && mv node_modules ../ && \
  apk del native-deps

COPY . .

RUN useradd -ms /bin/bash -u 1000 gobarber && \
  chown -R gobarber:gobarber ${API_DIR} && \
  setcap CAP_NET_BIND_SERVICE=+eip /usr/local/lib/node/bin/node

USER 1000

CMD ["npm", "start"]
