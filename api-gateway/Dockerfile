# Use the official Node.js 18.12.1 image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install project dependencies
RUN npm install --frozen-lockfile

# Copy the entire project directory to the container
COPY . .

# Change the working directory to the "api" directory
WORKDIR /app/api-gateway

# Build the node application
RUN npm install

# Expose the desired port (default is 4000)
EXPOSE 4000

# Start the index.js application
CMD ["node", "index.js"]
