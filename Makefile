# Ipswich Retail - Development Makefile

.PHONY: help dev-up dev-down migrate seed test lint format clean build

# Default target
help:
	@echo "Available commands:"
	@echo "  dev-up     - Start development environment with docker-compose"
	@echo "  dev-down   - Stop development environment"
	@echo "  migrate    - Run database migrations"
	@echo "  seed       - Load demo data"
	@echo "  test       - Run tests"
	@echo "  lint       - Run linting checks"
	@echo "  format     - Format code with black and isort"
	@echo "  clean      - Clean up temporary files"
	@echo "  build      - Build Docker images"

# Development environment
dev-up:
	docker-compose up --build -d
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "Admin: http://localhost:8000/admin"
	@echo "API Docs: http://localhost:8000/api/docs"

dev-down:
	docker-compose down
	@echo "Development environment stopped"

# Database operations
migrate:
	docker-compose exec backend python manage.py migrate
	@echo "Database migrations completed"

seed:
	docker-compose exec backend python manage.py seed_demo
	@echo "Demo data loaded successfully"

# Testing
test:
	docker-compose exec backend pytest
	@echo "Tests completed"

test-coverage:
	docker-compose exec backend pytest --cov=. --cov-report=html
	@echo "Test coverage report generated in htmlcov/"

# Code quality
lint:
	docker-compose exec backend flake8 .
	docker-compose exec backend black --check .
	docker-compose exec backend isort --check-only .
	@echo "Linting completed"

format:
	docker-compose exec backend black .
	docker-compose exec backend isort .
	@echo "Code formatting completed"

# Frontend operations
frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-lint:
	cd frontend && npm run lint

# Backend operations
backend-shell:
	docker-compose exec backend python manage.py shell

backend-createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

backend-collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

# Cleanup
clean:
	docker-compose down -v
	docker system prune -f
	@echo "Cleanup completed"

# Build
build:
	docker-compose build
	@echo "Docker images built"

# Health checks
health:
	@echo "Checking service health..."
	@curl -f http://localhost:8000/api/health/ || echo "Backend health check failed"
	@curl -f http://localhost:3000/ || echo "Frontend health check failed"

# Production deployment helpers
prod-build:
	docker-compose -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.prod.yml up -d

# Development shortcuts
dev: dev-up migrate seed
	@echo "Development environment ready!"

quick-test:
	docker-compose exec backend python manage.py test apps.core.tests.HealthCheckAPITest.test_health_check_endpoint

# Documentation
docs:
	@echo "API Documentation: http://localhost:8000/api/docs"
	@echo "ReDoc: http://localhost:8000/api/redoc"
	@echo "OpenAPI Schema: http://localhost:8000/api/schema/"

# Logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend
