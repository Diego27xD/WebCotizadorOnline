FROM node:18-alpine3.15

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npx prisma migrate dev --name deploy

RUN npx prisma generate

# Instalar LibreOffice y Java compatible (default-jre en lugar de openjdk-11-jre)
RUN apk update && \
    apk add --no-cache libreoffice openjdk8-jre && \
    rm -rf /var/cache/apk/*


EXPOSE 6005

CMD ["npm", "start"]
