FROM node:alpine

RUN mkdir -p /app/frontend/

WORKDIR /app/frontend

COPY ./apps/frontend/ .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]