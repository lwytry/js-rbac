FROM mhart/alpine-node:8.9.4

WORKDIR /permission
COPY package.json /permission/package.json
RUN npm i --registry=https://registry.npm.taobao.org

COPY src /permission/src
COPY view /permission/view
COPY www /permission/www
COPY production.js /permission/production.js

ENV DOCKER=true
EXPOSE 8360
CMD [ "node", "/permission/production.js" ]
