# Use the official Node.js 18 image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install Python and build dependencies for native modules
RUN apk --no-cache add python3 make g++ && \
    if [ ! -e /usr/bin/python ]; then ln -s python3 /usr/bin/python; fi

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies and rebuild bcrypt with all dependencies in place
RUN yarn install --frozen-lockfile && \
    yarn add bcrypt --build-from-source

# Bundle app source inside Docker image
COPY . .

# Build the application using Nest CLI
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]

# Clean up build tools to keep the image slim
RUN apk del make g++ && \
    rm -rf /var/cache/apk/*
