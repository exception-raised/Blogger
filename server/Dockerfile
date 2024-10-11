FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls

EXPOSE 5000

CMD ["node", "index.js"]
