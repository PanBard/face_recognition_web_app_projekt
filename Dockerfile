# FROM node:latest as builder
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build


# FROM nginx:alpine
# COPY --from=builder /app/dist/recognition_app/browser /usr/share/nginx/html/
# EXPOSE 80


# CMD ["nginx", "-g", "daemon off;"]

FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]