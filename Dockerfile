FROM node:6-alpine

LABEL Name="config-server" Version="0.1.0"

ENV NODE_ENV production

# MASTER TOKEN value. Supply your own in production
ENV MASTER_TOKEN replaceme

# MongoDB connection URL, see https://docs.mongodb.com/manual/reference/connection-string/ for examples
#ENV DB_URL mongodb://server/

ENV BIND_PORT 3000
EXPOSE 3000

ENV WD /app/

WORKDIR $WD

COPY ./package.json ./yarn.lock $WD

RUN yarn install --production && yarn cache clean

COPY ./ui $WD/ui/
COPY ./server $WD/server/

CMD ["node", "server/index.js", "MASTER_TOKEN=$MASTER_TOKEN", "DB_URL=$DB_URL", "BIND_PORT=$BIND_PORT"]