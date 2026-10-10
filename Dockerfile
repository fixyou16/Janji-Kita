FROM node:22-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN npm install --legacy-peer-deps
COPY . .

ENV VITE_AUTH_MODE=server
RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]
