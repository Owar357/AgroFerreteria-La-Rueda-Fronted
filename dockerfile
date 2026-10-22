# compilar con Node 
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# servir los archivos con Nginx 
FROM nginx:alpine

# Copiamos los archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos el archivo de configuración externa
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Comando obligatorio para que el servidor Nginx arranque y no se cierre
CMD ["nginx", "-g", "daemon off;"]