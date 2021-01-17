FROM node:12.18.4

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app/

USER node

COPY --chown=node:node . .

COPY . .

RUN yarn --ignore-scripts
RUN yarn build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]