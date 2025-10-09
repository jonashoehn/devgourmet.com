
FROM nginx:alpine

# Copy built files to nginx html directory (context is now project root)
COPY apps/web/dist /usr/share/nginx/html

# Copy nginx configuration (context is now project root)
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]