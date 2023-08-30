FROM node:18.16.0

WORKDIR /code

COPY ./frontend/package*.json ./

COPY ./frontend .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev::start" ]

# # Use the Node.js base image
# FROM node:18.16.0

# # Set the working directory
# WORKDIR /code

# # Copy package.json and package-lock.json files for dependency installation
# COPY ./frontend/package*.json ./

# # Install Node.js dependencies
# RUN npm install

# # Copy your frontend source code into the container
# COPY ./frontend .

# # Build your frontend
# RUN npm run build

# # Expose the port on which your application will run
# EXPOSE 3000

# # Install PM2 globally
# RUN npm install -g pm2

# # Use PM2 to start your Node.js application
# CMD ["pm2-runtime", "start", "npm", "--", "run", "dev::start"]