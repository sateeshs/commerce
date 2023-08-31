FROM node:18-alpine AS build

RUN apk add --no-cache libc6-compat

# WORKDIR /connect
# 
# COPY . .
# 
# RUN RM .env.local
# RUN mv .env.docker .env.local
# 
# RUN npm i --legacy-peer-deps
# 
# ENV AWS_BRANCH prod
# ENV REGION us-est-1
# ENV NODE_ENV production
# ENV NEXT_TEEMETRY_DISABLED 1
# 
# RUN npm run build
##RUN npm run post-build
# 
# EXPOSE 3000
# 
# ENV PORT 3000
# 
# CMD ["npm", "start"]

WORKDIR /app
#Copy and install dependecies for the project
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
#Copy all other project files
COPY . .
# Run next build
RUN npm run build


# Multi stage build process to keep the build size small

FRO node:18-alpine
# update and install latest dependencies and dubminit package 
# add non root user
RUN apk update && apk upgrade && apk add dumb-init && assuser -D nextuser

# set work dir as app
WORKDIR /app

COPY --rom=build --chown=nextuser:nextuser /app/public ./public
COPY --rom=build --chown=nextuser:nextuser /app/.next/standalone ./
COPY --rom=build --chown=nextuser:nextuser /app/.next/static ./.next/static
# Copy.env.local
COPY --rom=build --chown=nextuser:nextuser /app/.env.local ./

# Set non root user
USER nextuser

# EXPOSE 3000 on container
EXPOSE 3000

# set app host , port and node env
ENV HOST=0.0.0.0 POST=3000 NODE_ENV=production

# start the app with dubm init to spawn node.js process
# with signal support
CMD ["dumb-init","node", "server.js"] 

