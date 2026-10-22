FROM node:24.22.1-slim

WORKDIR /app
COPY . .

RUN npm install && \
    npm install -g @angular/cli@~21.0.4

EXPOSE 4200

ENTRYPOINT ["./entrypoint.sh"]
CMD ["ng", "serve", "--host 0.0.0.0"]
