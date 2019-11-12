FROM gcr.io/google_appengine/nodejs
RUN /usr/local/bin/install_node 12.13.0

WORKDIR /tmp/
COPY package.json package.json
RUN  npm install nodemon -g && npm install --unsafe-perm
WORKDIR /usr/src/
COPY . .
RUN mv /tmp/node_modules ./node_modules
EXPOSE 1337
CMD ["npm", "start"]
