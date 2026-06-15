FROM node:latest

COPY . .

RUN npm i

RUN npx prisma generate

RUN npx prisma migrate dev

CMD [ "node", "index.js" ]