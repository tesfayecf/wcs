# # Use the official NGINX image as the base image
# FROM nginx:1.25

# # Copy the NGINX configuration file to the container
# COPY nginx.conf /etc/nginx/nginx.conf

# # Expose the port on which NGINX will listen
# EXPOSE 80

# # Start NGINX when the container starts
# CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:18.16.0 as build
WORKDIR /code
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend .
RUN npm run build

# Runtime stage
FROM nginx:1.25
COPY --from=build /code/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]