# Dockerfile

# Étape 1: Construire l'application avec Vite.js et React
FROM node:lts-alpine as builder

WORKDIR /app

# Copier les fichiers de configuration de l'application
COPY package.json .
COPY package-lock.json .

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2: Distribuer l'application avec Nginx
FROM nginx:alpine as runner

# Copier les fichiers de construction de l'étape précédente dans le répertoire de contenu par défaut de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
