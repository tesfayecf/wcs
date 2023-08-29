# Use the official NGINX image as the base image
FROM nginx:latest

# Copy the NGINX configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port on which NGINX will listen
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]