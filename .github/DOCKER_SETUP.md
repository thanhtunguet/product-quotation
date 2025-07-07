# Docker Hub Setup Guide

This guide explains how to set up GitHub Actions to build and push Docker images to Docker Hub.

## Prerequisites

1. **Docker Hub Account**: Create an account at [hub.docker.com](https://hub.docker.com)
2. **Docker Hub Access Token**: Generate a personal access token for secure authentication

## Step 1: Create Docker Hub Access Token

1. Go to [Docker Hub Account Settings](https://hub.docker.com/settings/security)
2. Click "New Access Token"
3. Give it a descriptive name like "GitHub Actions - Product Quotation"
4. Select permissions: **Read & Write**
5. Copy the generated token (you won't see it again!)

## Step 2: Configure GitHub Repository Secrets

In your GitHub repository, go to **Settings** → **Secrets and Variables** → **Actions** and add these secrets:

### Required Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `myusername` |
| `DOCKERHUB_TOKEN` | Personal access token from Step 1 | `dckr_pat_abc123...` |

### Optional Secrets (for enhanced features)

| Secret Name | Description | Purpose |
|-------------|-------------|---------|
| `SNYK_TOKEN` | Snyk security scanning token | Security vulnerability scanning |

## Step 3: Configure Repository Names

The workflows automatically use your GitHub repository name to create Docker Hub repositories:

- Backend image: `your-username/your-repo-backend`
- Frontend image: `your-username/your-repo-frontend`

For example, if your repository is `johndoe/product-quotation`, the Docker images will be:
- `johndoe/product-quotation-backend`
- `johndoe/product-quotation-frontend`

## Step 4: Create Docker Hub Repositories (Optional)

While Docker Hub will auto-create repositories when you first push, you can pre-create them for better control:

1. Go to [Docker Hub](https://hub.docker.com)
2. Click "Create Repository"
3. Name: `your-repo-backend` and `your-repo-frontend`
4. Set visibility (Public/Private)
5. Add descriptions

## Step 5: Trigger the Workflows

The workflows will trigger automatically when you:

### Main Docker Build Workflow (`docker-build-push.yml`)
- Push to `main` or `develop` branches
- Create pull requests to `main` or `develop`
- Push version tags (e.g., `v1.0.0`)

### Release Workflow (`release.yml`)
- Create a GitHub release
- Manually trigger via workflow dispatch

### CI Workflow (`ci.yml`)
- Push to `develop` branch
- Create pull requests

## Docker Image Usage

Once the workflows run successfully, you can pull and use your images:

```bash
# Pull the latest images
docker pull your-username/your-repo-backend:latest
docker pull your-username/your-repo-frontend:latest

# Pull specific version
docker pull your-username/your-repo-backend:v1.0.0
docker pull your-username/your-repo-frontend:v1.0.0

# Use with docker-compose
# The release workflow generates a production docker-compose file
```

## Generated Artifacts

The release workflow creates deployment artifacts:

- `docker-compose.production.yml` - Production docker-compose configuration
- `.env.production.template` - Environment variables template
- `deploy.sh` - Deployment script for easy server setup

## Security Features

### Vulnerability Scanning
- **Trivy**: Scans Docker images for security vulnerabilities
- **Snyk**: Analyzes dependencies for known security issues
- **Dependency Review**: GitHub's built-in dependency scanning

### Multi-Architecture Support
Images are built for both:
- `linux/amd64` (Intel/AMD processors)
- `linux/arm64` (ARM processors, including Apple Silicon)

## Production Deployment

After a successful release, you can deploy to production:

1. Download the deployment artifacts from the GitHub release
2. Copy `.env.production.template` to `.env.production`
3. Configure your environment variables
4. Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh v1.0.0
```

## Troubleshooting

### Common Issues

**Authentication Failed**
- Check that `DOCKERHUB_USERNAME` matches your exact Docker Hub username
- Ensure `DOCKERHUB_TOKEN` is a valid access token (not your password)
- Verify the token has Read & Write permissions

**Repository Not Found**
- Docker Hub repositories are created automatically on first push
- Check that your repository name format is correct
- Ensure you have push permissions to the namespace

**Build Failures**
- Check the GitHub Actions logs for specific error messages
- Ensure your code builds successfully locally
- Verify all dependencies are properly specified

### Getting Help

1. Check the [GitHub Actions logs](../../actions) for detailed error messages
2. Review the [Docker Hub repository](https://hub.docker.com) for pushed images
3. Validate your secrets are correctly configured

## Workflow Files Overview

| File | Purpose | Triggers |
|------|---------|----------|
| `docker-build-push.yml` | Main CI/CD for Docker images | Push, PR, Tags |
| `release.yml` | Production releases with artifacts | GitHub releases |
| `ci.yml` | Code quality and testing | PR validation |

These workflows provide a complete CI/CD pipeline from development to production deployment.