FROM node:20

WORKDIR /app
COPY . .

RUN npm install && \
    npm install -g @angular/cli@11.0.5

EXPOSE 4200

ENTRYPOINT ["./entrypoint.sh"]
CMD ["ng", "serve", "--host 0.0.0.0"]
