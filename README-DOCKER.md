# 🐳 KRADIND Adventures - Docker Deployment Guide

This guide covers building, deploying, and running **KRADIND Adventures** (Next.js 15 + pnpm monorepo + MongoDB) using Docker and Docker Compose.

---

## 📋 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Quick Start (Docker Compose)](#-quick-start-docker-compose)
3. [Self-Hosted with Local MongoDB](#-self-hosted-with-local-mongodb)
4. [Standalone Docker Build & Run](#-standalone-docker-build--run)
5. [Environment Variables Reference](#-environment-variables-reference)
6. [VPS Production Deployment (Ubuntu/Debian)](#-vps-production-deployment-ubuntudebian)
7. [Nginx Reverse Proxy & SSL Setup](#-nginx-reverse-proxy--ssl-setup)
8. [Data Persistence & Backups](#-data-persistence--backups)
9. [Maintenance & Useful Commands](#-maintenance--useful-commands)

---

## 🏗 Architecture Overview

- **Base Image:** `node:20-alpine` (lightweight, secure, and fast).
- **Multi-Stage Build:**
  - `base`: Alpine with `libc6-compat`, `wget`, and `pnpm@9.15.4`.
  - `deps`: Caches `node_modules` layer using monorepo package manifests.
  - `builder`: Compiles Next.js 15 production bundle with zero bloat.
  - `runner`: Unprivileged non-root user (`nextjs:nodejs`), hardened security, automated health checks.
- **Port:** Exposes port `3000` (mapped to any host port via `${PORT:-3000}`).
- **Healthcheck:** Automated container verification via `/api/healthz`.

---

## 🚀 Quick Start (Docker Compose)

The easiest way to run the application using MongoDB Atlas cloud:

### 1. Configure Environment
Copy `.env.example` to `.env` (or configure your variables):
```bash
cp .env.example .env
```
Edit `.env` if you have custom credentials:
```env
PORT=3000
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
DATABASE_URL=mongodb+srv://...
ADMIN_SESSION_SECRET=kradind-secure-secret-key-himalayan-adventures-2026
COOKIE_SECURE=false
```

### 2. Build and Start the Container
```bash
docker compose up -d --build
```

### 3. Check Status and Logs
```bash
# Check container status
docker compose ps

# Follow live server logs
docker compose logs -f web
```

### 4. Visit the Website
Open your browser and navigate to:
- **Main Website:** `http://localhost:3000`
- **Admin Panel:** `http://localhost:3000/admin`
- **Health Check:** `http://localhost:3000/api/healthz`

---

## 🗄 Self-Hosted with Local MongoDB

If you prefer to run MongoDB directly in Docker (without MongoDB Atlas):

```bash
docker compose -f docker-compose.mongo.yml up -d --build
```
This starts:
1. `kradind-mongo`: Official MongoDB 7 container with automated healthcheck and volume persistence (`kradind_mongo_data`).
2. `kradind-adventures`: Web app automatically connected to the local mongo service.

---

## 📦 Standalone Docker Build & Run

If you want to use the Docker CLI directly without Docker Compose:

### 1. Build the Docker Image
```bash
docker build -t kradind-adventures:latest .
```

### 2. Run the Container
```bash
docker run -d \
  --name kradind-adventures \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  -e MONGODB_URI="mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority" \
  -e DATABASE_URL="mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority" \
  -e ADMIN_SESSION_SECRET="kradind-secure-secret-key-himalayan-adventures-2026" \
  -e COOKIE_SECURE=false \
  -v kradind_cms_data:/app/artifacts/kradind-adventures/data \
  -v kradind_uploads:/app/artifacts/kradind-adventures/public/uploads \
  kradind-adventures:latest
```

---

## ⚙️ Environment Variables Reference

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port on which the container server listens |
| `NODE_ENV` | `production` | Node.js execution environment |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public canonical URL for SEO, sitemaps, and metadata |
| `MONGODB_URI` | *Atlas Cluster URI* | Primary MongoDB connection string |
| `DATABASE_URL` | *Atlas Cluster URI* | Secondary alias for database connection |
| `ADMIN_SESSION_SECRET` | *Default Secret* | Secret string used to sign admin session tokens |
| `COOKIE_SECURE` | `false` | Set to `true` when your domain runs on HTTPS / SSL |

---

## 🖥 VPS Production Deployment (Ubuntu/Debian)

### Step 1: Install Docker & Docker Compose on VPS
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw ca-certificates gnupg

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```
*(Log out and log back in for user group changes to take effect).*

### Step 2: Clone Repository & Configure
```bash
git clone https://github.com/your-username/KRADIND-Adventures.git /var/www/kradind
cd /var/www/kradind

# Create .env from template
cp .env.example .env
nano .env
```
*(Set `COOKIE_SECURE=true` and `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`)*.

### Step 3: Launch with Docker Compose
```bash
docker compose up -d --build
```

---

## 🔒 Nginx Reverse Proxy & SSL Setup

For production on a public VPS, use Nginx with free Let's Encrypt SSL:

### 1. Install Nginx and Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Copy the Provided Nginx Config
Use the template from `docker/nginx/default.conf`:
```bash
sudo cp docker/nginx/default.conf /etc/nginx/sites-available/kradind
sudo nano /etc/nginx/sites-available/kradind
```
Replace `yourdomain.com` with your actual domain name.

### 3. Enable Site and Obtain SSL
```bash
sudo ln -s /etc/nginx/sites-available/kradind /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

# Obtain Let's Encrypt SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Reload Nginx
sudo systemctl restart nginx
```

---

## 💾 Data Persistence & Backups

KRADIND Adventures uses Docker volumes to ensure zero data loss during container upgrades or server reboots:

1. `kradind_cms_data`: Persists `data/cms-store.json` and fallback configurations.
2. `kradind_uploads`: Persists uploaded trek images, thumbnails, and PDFs.

### Backing up Docker Volumes
```bash
# Backup CMS data volume to a tarball
docker run --rm -v kradind_cms_data:/volume -v $(pwd):/backup alpine \
  tar -czf /backup/cms-data-backup-$(date +%F).tar.gz -C /volume .

# Backup Media Uploads volume to a tarball
docker run --rm -v kradind_uploads:/volume -v $(pwd):/backup alpine \
  tar -czf /backup/uploads-backup-$(date +%F).tar.gz -C /volume .
```

### Restoring Backups
```bash
docker run --rm -v kradind_cms_data:/volume -v $(pwd):/backup alpine \
  tar -xzf /backup/cms-data-backup-YYYY-MM-DD.tar.gz -C /volume
```

---

## 🛠 Maintenance & Useful Commands

| Task | Command |
| :--- | :--- |
| **View live logs** | `docker compose logs -f web` |
| **Check container health** | `docker inspect --format='{{json .State.Health}}' kradind-adventures` |
| **Restart container** | `docker compose restart web` |
| **Stop container** | `docker compose down` |
| **Update to latest code** | `git pull && docker compose up -d --build` |
| **Prune dangling Docker images** | `docker image prune -f` |
| **Execute bash inside container** | `docker exec -it kradind-adventures sh` |

---

✅ **Deployment Complete!** Your KRADIND Adventures platform is containerized, secure, and production-ready.
