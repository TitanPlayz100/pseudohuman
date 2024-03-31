FROM oven/bun

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install --silent
COPY . .

ENV NODE_ENV production

CMD [ "bun", "startbun" ]