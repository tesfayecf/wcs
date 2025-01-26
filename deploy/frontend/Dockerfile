# Use the Node.js base image
FROM node:18.16.0

# Set the working directory
WORKDIR /code

# Copy package.json and package-lock.json files for dependency installation
COPY ./frontend/package*.json ./

# Copy your frontend source code into the container
COPY ./frontend .

# Install Node.js dependencies
RUN npm install

# Build your frontend
RUN npm run build

# Expose the port on which your application will run
EXPOSE 3000

# Install PM2 globally
RUN npm install -g pm2

# Use PM2 to start your Node.js application
CMD ["pm2-runtime", "start", "npm", "--", "run", "dev::start"]