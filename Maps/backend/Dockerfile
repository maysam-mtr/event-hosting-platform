FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

# Install netcat (OpenBSD variant)
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
