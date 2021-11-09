FROM node:16-alpine3.11
COPY . .
RUN npm i npm@latest -g
RUN npm install --no-optional && npm cache clean --force
EXPOSE 3000
CMD [ "node", "index.js" ]