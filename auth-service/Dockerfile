FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev
RUN npm install -g nodemon

COPY . .

RUN npx prisma generate

EXPOSE 5001

CMD ["npm", "run", "dev"]