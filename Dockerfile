FROM node:alpine as build-deps

WORKDIR /usr/src/app

# Build frontend file using npm builder
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Take nginx image and add frontend build and config
FROM nginx:latest

COPY ./nginx.conf /etc/nginx/templates/nginx.conf.template
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html