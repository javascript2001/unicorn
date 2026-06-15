FROM node:latest

COPY . .

RUN npm i

RUN npx prisma generate

CMD [ "node", "index.js" ]