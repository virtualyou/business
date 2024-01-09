# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package*.json yarn.lock ./

# Install the dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application files to the container
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose port 3002 for the app to listen on
EXPOSE 3002

# Start the app
CMD ["node", "./dist/index.js"]
