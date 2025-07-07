# Docker Deployment Guide

This guide explains how to build and deploy the Product Quotation application using Docker.

## Architecture

The application consists of three main components:
- **Frontend**: React application served by nginx:alpine
- **Backend**: NestJS API server running on Node.js 22
- **Database**: MySQL 8.0 database

## GitHub Actions Workflows

### Individual Build Workflows

1. **Backend Build** (`.github/workflows/build-backend.yml`)
   - Triggers on changes to `apps/backend/**`
   - Builds backend using Node.js 22
   - Creates Docker image with production dependencies only
   - Pushes to GitHub Container Registry

2. **Frontend Build** (`.github/workflows/build-frontend.yml`)
   - Triggers on changes to `apps/product-quotation/**`
   - Builds frontend using Node.js 22 and Vite
   - Creates nginx-based Docker image
   - Pushes to GitHub Container Registry

3. **Combined Build** (`.github/workflows/build-all.yml`)
   - Builds both frontend and backend in parallel
   - Useful for full application deployments

### Workflow Features

- **Multi-stage builds**: Uses Node.js 22 to build, then creates production images
- **Security**: Non-root users, minimal dependencies
- **Caching**: npm cache optimization
- **Registry**: GitHub Container Registry (GHCR) for image storage
- **Tagging**: Semantic versioning with branch, PR, and SHA tags

## Local Development

### Using docker-compose

1. **Build and run all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run with pre-built images:**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

### Service URLs

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

## Production Deployment

### Pull and run images

```bash
# Pull latest images
docker pull ghcr.io/thanhtunguet/product-quotation/frontend:latest
docker pull ghcr.io/thanhtunguet/product-quotation/backend:latest

# Run with docker-compose
docker-compose -f docker-compose.dev.yml up -d
```

### Environment Variables

#### Backend Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | MySQL host | `mysql` |
| `DATABASE_PORT` | MySQL port | `3306` |
| `DATABASE_USERNAME` | MySQL username | `user` |
| `DATABASE_PASSWORD` | MySQL password | `password` |
| `DATABASE_NAME` | Database name | `product_quotation` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `NODE_ENV` | Node environment | `production` |

## Docker Images

### Backend Image Features

- **Base**: `node:22-alpine`
- **Security**: Non-root user (`nestjs:1001`)
- **Optimization**: Production dependencies only
- **Health checks**: Built-in health monitoring
- **Size**: Minimal footprint

### Frontend Image Features

- **Base**: `nginx:alpine`
- **Security**: Non-root user (`nginx_user:1001`)
- **Optimization**: Gzip compression, static caching
- **SPA Support**: Client-side routing support
- **Security Headers**: XSS protection, CSP, etc.
- **Health checks**: `/health` endpoint

## Build Process

### Backend Build Steps

1. Install Node.js 22
2. Install dependencies (`npm ci`)
3. Build with NX (`npx nx build backend --prod`)
4. Create Docker image with production dependencies
5. Push to registry

### Frontend Build Steps

1. Install Node.js 22
2. Install dependencies (`npm ci`)
3. Build with NX (`npx nx build product-quotation --prod`)
4. Create nginx-based Docker image
5. Push to registry

## Monitoring

### Health Checks

Both containers include health checks:

- **Backend**: Node.js version check
- **Frontend**: HTTP health endpoint at `/health`

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

## Security Features

### Container Security

- Non-root users in all containers
- Minimal Alpine Linux base images
- Production-only dependencies
- Security headers in nginx

### Network Security

- Internal container networking
- Exposed ports only where necessary
- Database credentials via environment variables

## Troubleshooting

### Common Issues

1. **Build failures**: Check Node.js version and dependencies
2. **Database connection**: Verify MySQL is running and accessible
3. **Frontend routing**: nginx configuration handles SPA routing
4. **Permissions**: Containers run as non-root users

### Debug Commands

```bash
# Check container status
docker-compose ps

# Inspect container
docker inspect <container_name>

# Access container shell
docker exec -it <container_name> /bin/sh

# View container resources
docker stats
```

## CI/CD Integration

The workflows are designed for:

- **Development**: Automatic builds on feature branches
- **Staging**: Builds on develop branch
- **Production**: Builds on main branch with `latest` tag
- **Pull Requests**: Build verification without pushing

### Registry Access

Images are stored in GitHub Container Registry:
- `ghcr.io/thanhtunguet/product-quotation/frontend:latest`
- `ghcr.io/thanhtunguet/product-quotation/backend:latest`

Authentication required for private repositories.