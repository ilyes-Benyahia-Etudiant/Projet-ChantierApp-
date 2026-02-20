# === Étape 1 : Build (Construction) ===
# On utilise une image Node.js légère (alpine) pour construire l'application
FROM node:20-alpine AS builder

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances (package.json et package-lock.json)
# On le fait avant de copier le reste pour profiter du cache Docker si les dépendances ne changent pas
COPY package*.json ./

# Copie du dossier prisma nécessaire pour la génération du client DB
COPY prisma ./prisma/

# Installation des dépendances de manière propre (ci = clean install)
RUN npm ci

# Copie de tout le reste du code source (doit inclure tsconfig.json !)
COPY . .

# Génération du client Prisma (ORM pour la base de données)
RUN npx prisma generate

# Compilation de l'application NestJS (crée le dossier dist/)
RUN npm run build

# === Étape 2 : Production ===
# On repart d'une image vierge pour n'avoir que le nécessaire à l'exécution (plus léger, plus sécurisé)
FROM node:20-alpine

WORKDIR /app

# On copie uniquement les fichiers compilés et nécessaires depuis l'étape de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# On expose le port 3000 sur lequel tourne l'API NestJS
EXPOSE 3000

# Commande de démarrage de l'application en mode production
CMD ["node", "dist/src/main.js"]
