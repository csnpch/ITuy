FROM node:8.11.4
COPY ./Published /var/node/www
WORKDIR /var/node/www
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]