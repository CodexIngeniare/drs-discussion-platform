# Koristi Node.js sliku
FROM node:16

# Postavi radni direktorijum unutar kontejnera
WORKDIR /app

# Kopiraj package.json i package-lock.json
COPY package*.json ./

# Instaliraj zavisnosti
RUN npm install

# Kopiraj sav kod aplikacije u kontejner
COPY . .

# Izloži port 3000 za frontend
EXPOSE 3000

# Pokreni aplikaciju
CMD ["npm", "start"]
