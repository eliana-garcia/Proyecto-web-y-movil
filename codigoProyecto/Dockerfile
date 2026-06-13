FROM node:24.14.1

WORKDIR /frontend

COPY package*.json ./

RUN npm install

RUN npm install -g @ionic/cli

COPY . .

EXPOSE 8100

CMD ["ionic", "serve", "--external", "--port", "8100"]