#building app
FROM node:12.16.1  as builder
RUN apt-get update && apt-get install -y bash vim telnet
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
RUN npm audit fix
COPY . ./

CMD npm run dev