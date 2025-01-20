# Step 1: Build the app
FROM node:16 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Step 2: Create the production image
FROM node:16-slim

WORKDIR /app

COPY --from=builder /app ./
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]
