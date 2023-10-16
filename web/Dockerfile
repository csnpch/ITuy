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

# Change the working directory to the "web" directory
WORKDIR /app/web

# Build the Next.js application
RUN npm install next
RUN npm run build

# Expose the desired port (default is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
