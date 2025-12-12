# Étape 1 : build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build    # ou npm run build --prod selon ton setup

# Étape 2 : serveur web (Nginx)
FROM nginx:alpine

# On copie notre conf nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# On copie les fichiers générés (dist ou build selon ton projet)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
