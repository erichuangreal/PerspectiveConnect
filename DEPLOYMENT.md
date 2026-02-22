# PerspectiveConnect — Deployment

Production deployment for **PerspectiveConnect** (AI presentation training). This file is the main entry point; detailed guides live in `docs/`.

---

## Overview

| Item | Value |
|------|--------|
| **Stack** | Next.js 14 (frontend), FastAPI (backend), MySQL 8 |
| **Production dir** | `/opt/perspectiveconnect` |
| **Compose (prod)** | `docker-compose.prod.yml` |
| **Backend port** | 9000 (127.0.0.1) |
| **Frontend port** | 5500 (127.0.0.1) |
| **MySQL port (host)** | 3308 (127.0.0.1) |
| **Reverse proxy** | Nginx → backend 9000, frontend 5500 |
| **Deploy script** | `./deploy-versioned.sh` (or `./deploy.sh`) |

---

## Which guide to use

| Situation | Guide |
|-----------|--------|
| **First time deploying** | [docs/FIRST-DEPLOYMENT.md](./docs/FIRST-DEPLOYMENT.md) — full step-by-step (30–45 min) |
| **Server ready, quick deploy** | [docs/QUICKSTART.md](./docs/QUICKSTART.md) — short path (≈5 min) |
| **Full reference** | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) — Docker + manual, Nginx, SSL, security, backups |
| **Versioning & rollback** | [docs/VERSIONING.md](./docs/VERSIONING.md) — versioned deploys, rollback |
| **Command cheatsheet** | [docs/DEPLOYMENT-CHEATSHEET.md](./docs/DEPLOYMENT-CHEATSHEET.md) |

---

## Quick production path (Docker)

Assumes Docker and Docker Compose are installed and you have an OpenAI API key.

```bash
# 1. Clone
sudo mkdir -p /opt && sudo chown "$USER:$USER" /opt
git clone <your-repo-url> /opt/perspectiveconnect
cd /opt/perspectiveconnect

# 2. Environment
cp config/.env.production.example backend/.env
# Edit backend/.env: OPENAI_API_KEY, JWT_SECRET, DB_PASSWORD, etc.
# Ensure backend/.env has MYSQL_ROOT_PASSWORD matching DB_PASSWORD if needed by compose

# 3. Deploy (builds and starts containers)
./scripts/deploy-versioned.sh
# or: ./deploy.sh   (if deploy.sh → scripts/deploy-versioned.sh)

# 4. Verify
docker compose -f docker-compose.prod.yml ps
curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/docs   # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:5500         # expect 200
```

Then configure Nginx to proxy your domain to `http://127.0.0.1:5500` (frontend) and e.g. `/api` → `http://127.0.0.1:9000`, and set up SSL (e.g. Certbot). See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for Nginx and SSL.

---

## Versioned deployments (recommended)

- **Deploy / update:** `./deploy-versioned.sh` (or `./deploy.sh`)
- **Rollback:** `./scripts/rollback.sh`
- **History:** `./list-versions.sh`
- **Clean old versions:** `./scripts/cleanup-versions.sh`

Versions are stored under `/opt/perspectiveconnect-versions/`. See [docs/VERSIONING.md](./docs/VERSIONING.md).

---

## Docker Compose (production)

Use the **Docker Compose V2** CLI (`docker compose`, not `docker-compose`).

```bash
cd /opt/perspectiveconnect

# Build and start
docker compose -f docker-compose.prod.yml up -d --build

# Status
docker compose -f docker-compose.prod.yml ps

# Logs
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend

# Restart
docker compose -f docker-compose.prod.yml restart

# Stop
docker compose -f docker-compose.prod.yml stop
```




Containers: `pc_mysql`, `pc_backend`, `pc_frontend`. Backend runs `uvicorn` with 4 workers; frontend uses `NEXT_PUBLIC_API_BASE` (set in compose or env, e.g. `https://pc.appfounder.ca/api`).

---

## Environment

- **Backend:** `backend/.env` (copy from `config/.env.production.example` or `backend/.env.example`). Required: `OPENAI_API_KEY`, `JWT_SECRET`, DB_* (use `DB_HOST=mysql` in Docker).
- **Frontend:** API base URL is set via build arg / env in `docker-compose.prod.yml`: `NEXT_PUBLIC_API_BASE` (e.g. `https://pc.appfounder.ca/api`).
- Do not commit secrets; keep `backend/.env` and any root `.env` only on the server.

---

## Troubleshooting

| Issue | Action |
|-------|--------|
| Deploy fails / health check fails | `docker compose -f docker-compose.prod.yml logs -f backend` (and frontend); fix config or code and re-run `./deploy-versioned.sh`. |
| Backend 502 / not responding | Check backend logs; ensure MySQL is healthy and `backend/.env` DB_* match `docker-compose.prod.yml`. |
| Frontend can’t reach API | Ensure `NEXT_PUBLIC_API_BASE` matches the public API URL and Nginx proxies `/api` to port 9000. |
| MySQL not healthy | `docker compose -f docker-compose.prod.yml logs mysql`; ensure `backend/.env` has correct `MYSQL_ROOT_PASSWORD` if used by compose. |

More: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) and [docs/QUICKSTART.md](./docs/QUICKSTART.md).

---

## Quick reference

| Task | Command |
|------|--------|
| Deploy / update | `./deploy-versioned.sh` or `./deploy.sh` |
| Rollback | `./scripts/rollback.sh` |
| List versions | `./list-versions.sh` |
| Container status | `docker compose -f docker-compose.prod.yml ps` |
| All logs | `docker compose -f docker-compose.prod.yml logs -f` |
| Restart services | `docker compose -f docker-compose.prod.yml restart` |

For Nginx, SSL, firewall, backups, and manual (non-Docker) deployment, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).
