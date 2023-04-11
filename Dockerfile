FROM node:16

WORKDIR /app

COPY ./server/package*.json ./

RUN npm ci

COPY ./server .

CMD ["npm", "start"]
