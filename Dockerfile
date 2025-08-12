FROM node:18-bullseye

# Instalar LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN mkdir -p ./output-docx ./output-pdf
RUN npx prisma generate

EXPOSE 6005
CMD ["npm", "start"]
