FROM node:24.22.1-slim

WORKDIR /app
COPY . .

RUN npm ci

EXPOSE 3001

CMD ["npm", "start"]
