FROM node:20-alpine
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["pnpm", "start"]
