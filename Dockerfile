###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm install -f

COPY . .

RUN npm run build

EXPOSE 3000 3131 3232

ARG NODE_ENV=dev

ENV env_NODE_ENV=$NODE_ENV

# Start the server using the production build
CMD npm run start$env_NODE_ENV:linux