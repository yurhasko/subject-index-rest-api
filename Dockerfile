FROM node:lts

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

RUN npx tsc

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
