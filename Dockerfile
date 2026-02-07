FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Prune dev dependencies for final image
RUN npm prune --production

EXPOSE 3001

CMD ["node", ".next/standalone/server.js"]
