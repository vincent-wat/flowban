# Use a Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies inside the container
COPY package*.json ./

RUN npm install --omit=dev

# Remove bcrypt and reinstall it inside the container
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the Backend files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
