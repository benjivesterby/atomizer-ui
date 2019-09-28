FROM nginx:alpine
LABEL version="0.0.1"

#COPY nginx.conf /etc/nginx/nginx.conf

# Set the working directory to nginx default
WORKDIR /usr/share/nginx/html

# Copy angular production build to WORKDIR
COPY dist/atomizer-ui/ .

# Make port 80 available to the world outside this container
EXPOSE 80