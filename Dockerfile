FROM node as builder
WORKDIR /index
COPY package.json /index
RUN npm i
COPY . /index
CMD ["npm","run","start"]
