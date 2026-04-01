# --------- FRONTEND BUILD ---------
FROM node:20 AS frontend-build

WORKDIR /app
COPY frontend/ .
RUN npm install && npm run build


# --------- BACKEND + NGINX ---------
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# install dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg nginx && \
    rm -rf /var/lib/apt/lists/*

# install python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend
COPY backend/ ./backend

# copy frontend build
COPY --from=frontend-build /app/dist /app/frontend

# nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# run both services
CMD nginx -g "daemon off;" & gunicorn --bind 0.0.0.0:7272 backend.app:app