# Use official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app’s files into the container
COPY . .

# Expose the port your Next.js app will run on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]
