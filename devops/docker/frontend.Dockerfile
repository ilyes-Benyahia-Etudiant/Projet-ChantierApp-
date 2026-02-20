# === Étape 1 : Build (Construction de l'app React) ===
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances (ajustement du chemin car le contexte est la racine)
COPY front/package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY front/ .

# Build
RUN npm run build

# === Étape 2 : Production (Serveur Web Nginx) ===
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la config nginx depuis le dossier devops (possible car contexte = racine)
COPY devops/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
