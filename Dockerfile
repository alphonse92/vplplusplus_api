FROM gcr.io/google_appengine/nodejs
RUN /usr/local/bin/install_node 9.3.0
WORKDIR /usr/src/app
COPY . .
RUN npm install nodemon -g
RUN npm install --unsafe-perm 
EXPOSE 1337
CMD ["npm", "start"]
