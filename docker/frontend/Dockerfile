FROM node:18.16.0

WORKDIR /code

COPY ./frontend/package*.json ./

COPY ./frontend .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run" "dev::start" ]