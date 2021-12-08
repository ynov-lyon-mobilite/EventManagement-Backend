FROM node:16 as base
WORKDIR /srv/api

COPY package.json .
COPY ./prisma ./prisma
COPY ./.env ./.env
RUN yarn install

FROM base as compiler
WORKDIR /srv/compiler
COPY package.json /srv/compiler/package.json
RUN yarn install --ignore-scripts
