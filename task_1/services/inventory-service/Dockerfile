FROM node:18-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE $INVENTORY_PORT

CMD ["npm", "start"]
