FROM node:20

# Install tzdata for timezone support
RUN apt-get update && apt-get install -y tzdata

ENV TZ=Asia/Beirut

# Optional: Log the time during build to confirm
RUN date

# Install docker CLI (without Docker daemon)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker’s official GPG key and repo
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update && apt-get install -y docker-ce-cli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

RUN npm install -g nodemon

CMD ["npm", "run", "dev"]
