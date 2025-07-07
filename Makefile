# Product Quotation - Docker Commands

.PHONY: help build build-backend build-frontend up down logs clean dev-build dev-up

# Default target
help:
	@echo "Available commands:"
	@echo "  build         - Build both frontend and backend images"
	@echo "  build-backend - Build only backend image"
	@echo "  build-frontend- Build only frontend image"
	@echo "  up            - Start all services with docker-compose"
	@echo "  down          - Stop all services"
	@echo "  logs          - View logs from all services"
	@echo "  clean         - Remove all containers and images"
	@echo "  dev-build     - Build and start services for development"
	@echo "  dev-up        - Start using pre-built images from registry"

# Build commands
build:
	@echo "Building both images..."
	npm ci
	npx nx build backend --prod
	npx nx build product-quotation --prod
	docker-compose build

build-backend:
	@echo "Building backend..."
	npm ci
	npx nx build backend --prod
	docker build -f Dockerfile.backend -t product-quotation-backend .

build-frontend:
	@echo "Building frontend..."
	npm ci
	npx nx build product-quotation --prod
	docker build -f Dockerfile.frontend -t product-quotation-frontend .

# Docker compose commands
up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

# Development commands
dev-build: build
	docker-compose up -d

dev-up:
	docker-compose -f docker-compose.dev.yml up -d

# Cleanup
clean:
	docker-compose down -v
	docker system prune -a -f
	docker volume prune -f

# Database commands
db-reset:
	docker-compose down mysql
	docker volume rm product-quotation_mysql_data
	docker-compose up -d mysql

# Status
status:
	docker-compose ps