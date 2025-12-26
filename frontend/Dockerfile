FROM node:24-slim

WORKDIR /app
COPY . .

RUN npm install && \
    npm install -g @angular/cli@~16.1.0

EXPOSE 4200

ENTRYPOINT ["./entrypoint.sh"]
CMD ["ng", "serve", "--host 0.0.0.0"]
