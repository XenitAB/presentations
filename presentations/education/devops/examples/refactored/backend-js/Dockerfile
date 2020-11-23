FROM node:slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV IFACE="0.0.0.0"
CMD [ "node", "main.js" ]
