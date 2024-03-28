# Stage 1: Install dependencies and compile typescript
FROM node:18-alpine3.17 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Only Copy compiled js files
FROM node:18-alpine3.17 as ts-remover
WORKDIR /usr/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=ts-compiler /usr/app/build /usr/app/build

RUN mkdir -p /.npm
RUN chmod 777 "/.npm"

CMD ["npm", "start"]