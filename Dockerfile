# Use official Node.js LTS image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Start application
CMD ["npm", "run", "preview"]
