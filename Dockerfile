# Base image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Install TypeScript globally
RUN npm install -g typescript

# Set working directory
WORKDIR /app

# Copy the package.json, pnpm-lock.yaml, and tsconfig.json files to the container
COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .

# Copy the project's source
COPY src/ .

# Install dependencies using pnpm
RUN pnpm fetch
RUN pnpm install -r --offline

# Build the TypeScript project
RUN pnpm run build

# Set the command to run the built application
CMD ["pnpm", "run", "start"]