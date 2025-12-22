# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN echo "Build Args Check: URL=${NEXT_PUBLIC_SUPABASE_URL:0:10}..."

RUN npm run build
RUN ls -Fal /app

# Serve Stage
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
