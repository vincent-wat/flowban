# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend project files
COPY . .

# Expose the port that the frontend runs on
EXPOSE 3001

RUN mkdir -p /app/node_modules/pdfjs-dist/legacy/web/images && \
    curl -o /app/node_modules/pdfjs-dist/legacy/web/images/altText_add.svg https://raw.githubusercontent.com/mozilla/pdf.js/master/web/images/altText_add.svg && \
    curl -o /app/node_modules/pdfjs-dist/legacy/web/images/altText_done.svg https://raw.githubusercontent.com/mozilla/pdf.js/master/web/images/altText_done.svg


# Start the React app
CMD ["npm", "start"]
