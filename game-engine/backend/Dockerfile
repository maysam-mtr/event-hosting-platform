# Use Node.js 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy only the files we need first (for better Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code (excluding node_modules via .dockerignore)
COPY . .

# Start using your dev script (like with nodemon or ts-node)
CMD ["npm", "run", "dev"]
