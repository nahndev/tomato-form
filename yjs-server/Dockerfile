FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json ./
COPY server.ts ./
COPY proto ./proto
EXPOSE 3028
CMD ["npx", "tsx", "server.ts"]
