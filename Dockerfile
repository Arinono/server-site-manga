# No layering
FROM node:latest

WORKDIR /app
COPY . .
RUN npm i

ENTRYPOINT [ "node", "/app/index.js" ]

###

# Good layering
FROM node:latest

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm i
COPY . .

ENTRYPOINT [ "node", "/app/index.js" ]

###

# Overkill layering, just for fun
FROM node:latest

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm i
COPY models .
COPY resolvers .
COPY schemas .
COPY . .

# This is actually decent when you don't have too much things.

ENTRYPOINT [ "node", "/app/index.js" ]

# N.B.: I did not try these images, it's just gut feelings, but the idea is here.
