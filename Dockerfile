# Stage 1: Build the TypeScript application
FROM node:20-slim AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
# This step leverages Docker's build cache. If dependencies don't change,
# these steps (COPY and npm install) will be skipped on subsequent builds.
COPY package*.json ./

# Install project dependencies
# Use --omit=dev if you don't need devDependencies in the final runtime image
# Use --immutable if using package-lock.json for strict installs
RUN npm install

# Copy the rest of your application source code
COPY . .

# Build the TypeScript code into JavaScript
# This will compile your .ts files from `src` into .js files in the `dist` directory
RUN npm run build

# Stage 2: Create a lightweight production-ready image
# Use a smaller base image for the final deployed application
FROM node:20-slim

# Set the working directory for the runtime environment
WORKDIR /app

# Copy only the necessary files from the builder stage
# This includes compiled JavaScript files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./ # Copy package.json for npm start


RUN npm install --production --immutable

# Expose the port your Express application listens on
# This needs to match the PORT your Express app uses (5000 in your server.ts)
EXPOSE 5000

# Command to run the application
# Railway will execute this command when your service starts.
# It uses the compiled JavaScript from the 'dist' directory.
CMD ["npm", "start"]

# Optional: Environment variable for Railway
# Railway often automatically sets the PORT, but you can explicitly expose it if needed
# ENV PORT=5000