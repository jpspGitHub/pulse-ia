FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install

CMD ["pnpm", "--filter", "@pulseia/api", "dev"]
