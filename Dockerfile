FROM node:16-alpine
# Create app directory
WORKDIR /app/build

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY *.json ./

RUN npm install && npm run build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "node", "dist/main" ]