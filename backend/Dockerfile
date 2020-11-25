FROM node:14.13.1-stretch

WORKDIR /app
COPY . .

RUN npm ci

EXPOSE 3001

CMD ["npm", "start"]


