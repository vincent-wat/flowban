# Use Node.js as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies inside the container
RUN npm install --omit=dev

# Rebuild bcrypt inside the container to match the OS
RUN npm install --omit=dev && npm install --save-dev sequelize-cli

# Copy the rest of the backend files
COPY . .

# Expose backend port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
