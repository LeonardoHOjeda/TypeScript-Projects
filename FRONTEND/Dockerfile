FROM node
RUN apt update
RUN apt install nginx -y
RUN apt install nano -y
RUN apt install iputils-ping -y

WORKDIR /app
COPY . /app
RUN yarn
COPY ./nginx/default /etc/nginx/sites-available
EXPOSE 80
CMD yarn build;nginx -g "daemon off;";