FROM node:alpine
COPY package.json .
RUN npm install
COPY . /usr/src/app
CMD ["npm", "run", "start"]