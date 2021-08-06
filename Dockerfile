# This one will be a lot more fun with some tricks
FROM node:latest as builder

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .
# ncc is a tool to bundle all JS files and their deps into a single file.
# with this we go from a (uncompressed) 1.2Gb (yes node:latest is big) to 120Mb image
RUN npx -y @vercel/ncc build -m server.js -o index.js --source-map

FROM node:alpine as server

WORKDIR /app
COPY --from=builder /app/index.js .

ENTRYPOINT [ "node", "/app/index.js" ]
