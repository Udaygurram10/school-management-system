# Use Node.js as the base image
FROM node:18

# Create app directory and set ownership
WORKDIR /app
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Copy package.json and package-lock.json files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=node:node . .

# Create and set permissions for .next directory
RUN mkdir -p .next && chown -R node:node .next

# Generate Database
RUN npx prisma migrate dev --name init

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]