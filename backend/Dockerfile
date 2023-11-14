FROM node:18
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
RUN npm test
CMD npm run start:prod
