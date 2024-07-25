FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/main"]