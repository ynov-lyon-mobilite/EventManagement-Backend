FROM node:15-alpine as base
RUN apk update
RUN apk add --no-cache --virtual build-deps python alpine-sdk autoconf libtool automake libc6-compat

FROM base as deps
WORKDIR /deps
COPY package*.json ./
RUN npm ci



FROM base as builder
WORKDIR /builder
COPY . .
COPY --from=deps /deps/node_modules ./node_modules
RUN npm run prisma:generate:client
RUN npm run build


FROM base as runner
ENV NODE_ENV production

COPY --from=builder /builder/next.config.js ./
COPY --from=builder /builder/public ./public
COPY --from=builder /builder/.next ./.next
COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/package.json ./package.json

EXPOSE 3000

CMD ["npm" , "start"]
