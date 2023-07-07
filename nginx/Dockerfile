ARG VERSION=latest
FROM tapyrus/explorer-frontend:${VERSION} as builder
RUN npm run build -- --configuration=production

FROM nginx:1.17
COPY --from=builder /app/www /usr/share/nginx/html
COPY config.json /usr/share/nginx/html/assets
COPY nginx.conf /etc/nginx/conf.d/default.conf
