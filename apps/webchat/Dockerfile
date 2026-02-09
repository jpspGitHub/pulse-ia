FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install

CMD ["pnpm", "--filter", "@pulseia/webchat", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
