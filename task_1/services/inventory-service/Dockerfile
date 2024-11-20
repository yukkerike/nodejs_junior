FROM node:18-alpine

WORKDIR /app

COPY . .
RUN npm install

EXPOSE 3001

RUN ls /app
RUN ls /app/src

CMD ["npm", "start"]
