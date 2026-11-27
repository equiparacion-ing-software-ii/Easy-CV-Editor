###Me voy a enfocar en que sea multi-etapa (multi-stage), para que sea más liviano
#Primera etapa:
#Me fijo en la última LTS a la fecha, en vez de "latest" (alpine porque es la más ligera)
    FROM node:22-alpine AS base
    
    WORKDIR /app
    #En vez de correr todo como root, uso el usuario 'node'
    RUN chown -R node:node /app
  
#Segunda etapa:
    FROM base AS dependencies
    #Ejecuto los siguientes comandos como el usuario 'node' creado previamente
    USER node
    #copio los manifiestos de paquetes
    COPY --chown=node:node package*.json ./
    #No instalar cypress por defecto
    ENV CYPRESS_INSTALL_BINARY=0 

    #Por qué instalo con "npm ci" (clean install) en vez de "npm install" - Dá error ante ediciones manuales de versiones de paquetes, más predecible en flujos automatizados
    #https://www.baeldung.com/ops/npm-install-vs-npm-ci 
    RUN npm ci

    ###Etapa de desarrollo
    FROM base AS dev
    ENV NODE_ENV=development
    #Ejecuto los siguientes comandos como el usuario 'node' creado previamente
    USER node
    #copiar las dependencias ya instaladas
    COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
    #copiar todo el repositorio dentro del contenedor
    COPY --chown=node:node . .
    #exponer el puerto de Vite (5173 por defecto)
    EXPOSE 5173
    #levantar el servidor de desarrollo
    CMD ["npm", "run", "dev"]
    
    ###Etapa independiente de testing con Cypress
    FROM cypress/included:16.1.1 AS cypress
    WORKDIR /app
    ENV CYPRESS_INSTALL_BINARY=0
    COPY package*.json ./
    RUN npm ci