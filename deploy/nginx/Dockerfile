# Runtime stage
FROM nginx:1.25

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]