# ---- STAGE 1: Build the React app ----
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application and build
COPY . .
RUN npm run build

# ---- STAGE 2: Serve the built app with nginx ----
FROM nginx:alpine

# Copy build artifacts from the first stage to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Use nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

