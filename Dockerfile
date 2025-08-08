# Use the official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:focal

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies first (cache)
COPY package.json package-lock.json* ./

RUN npm install

# Copy the rest of your app source code
COPY . .

# Expose your port (adjust if your app listens on a different port)
EXPOSE 3000

# Start your app
CMD ["node", "index.js"]
