# Product Quotation System

A comprehensive business quotation management system built with NestJS (backend) and React (frontend), featuring professional PDF generation, multi-language support, and complete Docker deployment.

## 🌟 Features

- **📋 Quotation Management**: Create, edit, and manage business quotations
- **🏢 Master Data**: Categories, brands, manufacturers, materials, colors, sizes
- **📄 PDF Export**: Professional business quotations with company branding
- **🌐 Multi-language**: English and Vietnamese support
- **🔄 Excel Import/Export**: Bulk product management
- **🐳 Docker Ready**: Complete containerization with Docker Hub integration
- **🔒 Security**: Built-in authentication and authorization
- **📱 Responsive**: Mobile-friendly interface

## 🚀 Quick Start with Docker

### Pull from Docker Hub

```bash
# Pull the latest images
docker pull your-username/product-quotation-backend:latest
docker pull your-username/product-quotation-frontend:latest

# Or use docker-compose (recommended)
curl -O https://raw.githubusercontent.com/your-username/product-quotation/main/docker-compose.yml
docker-compose up -d
```

### Access the Application

- **Frontend**: http://localhost (Nginx)
- **Backend API**: http://localhost:3000 (NestJS)
- **API Documentation**: http://localhost:3000/api (Swagger)

## 🐳 Docker Deployment

### GitHub Actions + Docker Hub

This repository includes comprehensive GitHub Actions workflows that automatically build and push Docker images to Docker Hub.

#### Setup Instructions

1. **Configure Secrets**: Add these to your GitHub repository secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Docker Hub access token

2. **Automatic Building**: Images are built automatically on:
   - Push to `main` or `develop` branches
   - Creating releases (with version tags)
   - Pull requests (build-only, no push)

3. **Multi-Architecture**: Images support both `linux/amd64` and `linux/arm64`

📚 **[Complete Docker Setup Guide](.github/DOCKER_SETUP.md)**

### Production Deployment

```bash
# Download deployment artifacts from GitHub releases
wget https://github.com/your-username/product-quotation/releases/latest/download/deployment-artifacts.zip
unzip deployment-artifacts.zip

# Configure environment
cp .env.production.template .env.production
# Edit .env.production with your settings

# Deploy
chmod +x deploy.sh
./deploy.sh latest
```

### Docker Images

| Component | Docker Hub Repository | Description |
|-----------|----------------------|-------------|
| Backend | `your-username/product-quotation-backend` | NestJS API server |
| Frontend | `your-username/product-quotation-frontend` | React SPA with Nginx |

### Available Tags

- `latest` - Latest stable release
- `develop` - Development branch builds  
- `v1.0.0` - Specific version releases
- `main` - Main branch builds

## 🛠️ Development Setup

### Prerequisites

- Node.js 22+ 
- Docker & Docker Compose
- MySQL 8.0+ (for local development)

### Local Development


## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve product-quotation
```

To create a production bundle:

```sh
npx nx build product-quotation
```

To see all available targets to run for a project, run:

```sh
npx nx show project product-quotation
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/react:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
