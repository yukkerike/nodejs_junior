FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
# RUN npm run migration:run

EXPOSE $PORT

CMD ["npm", "run", "start"]