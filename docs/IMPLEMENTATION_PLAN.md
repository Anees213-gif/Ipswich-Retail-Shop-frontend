# Ipswich Retail - Implementation Plan

## A) MVP Scope (Functional)

### Storefront MVP
- **Home Page**: Hero section + featured products carousel
- **Product Listing**: 
  - Filters: search, category, price range, rating, brand, sort options
  - Pagination with page size controls
  - Grid/list view toggle
- **Product Detail**: 
  - Image gallery with zoom
  - Brand badge display
  - Related products section
  - Add to cart with quantity selector
- **Cart & Checkout**: 
  - Email + shipping address fields
  - Order summary with tax/shipping calculations
  - Order submission with confirmation
- **Brand Filter**: Brand chips/filter (e.g., Crucial, Samsung, etc.)

### Admin MVP
- **Dashboard KPIs**: 
  - Orders today, revenue today, avg order value, error rate
  - 7-day order trend chart
  - Recent orders list
- **Orders Management**: 
  - List with filters (status, date, customer)
  - Bulk status updates
  - Order detail view with items
- **Products Management**: 
  - List with search/filter by category, brand, stock status
  - Edit product details (price, stock, featured status)
  - Image upload and management
- **Simple Auth**: JWT-based authentication for admin users

### API MVP
- **Authentication**: 
  - Register endpoint for admin users
  - JWT token/refresh endpoints
  - Session-based auth for compatibility
- **Categories**: CRUD operations with product counts
- **Products**: 
  - List with filters (search, category, brand, price, rating, sort, pagination)
  - Detail view with related products
  - Admin CRUD operations
- **Cart**: 
  - Guest cart via X-Session-Token header
  - User cart via JWT authentication
  - Add/update/remove items with stock validation
- **Orders**: 
  - Create order endpoint
  - My orders endpoint (authenticated users)
  - Admin order management endpoints
- **Health & Metrics**: 
  - `/health` endpoint (status, version, timestamp)
  - `/metrics` endpoint (Prometheus format)
- **API Documentation**: 
  - OpenAPI schema at `/api/schema/`
  - Swagger UI at `/api/docs`

## B) DevOps MVP

### Containerization
- **Multi-stage Dockerfiles**: Optimized builds for both frontend and backend
- **Docker Compose**: 
  - `db` service (PostgreSQL 15)
  - `api` service (Django backend)
  - `frontend` service (React build)
  - Health checks for all services
- **Production Setup**: 
  - Gunicorn for Django (production WSGI server)
  - Nginx for static files (optional)
  - Proper environment variable handling

### CI/CD Pipeline
- **GitHub Actions Workflow**:
  - Lint checks (flake8, isort, black for Python; ESLint for TypeScript)
  - Type checking (mypy for Python; TypeScript compiler)
  - Test execution with PostgreSQL service
  - Coverage reporting (minimum 70% target)
  - Docker image building and testing
  - Optional deploy job placeholders (Render/Railway hooks)

### Testing Infrastructure
- **Backend Testing**:
  - pytest + factory_boy for API and model tests
  - Test database setup with fixtures
  - API endpoint testing with authentication
  - Model validation and business logic tests
- **Frontend Testing**:
  - Vitest + React Testing Library for component tests
  - Critical user flow testing (cart, checkout, product browsing)
  - API integration testing with mock responses
- **Coverage Target**: Minimum 70% code coverage

### Observability
- **Structured Logging**: 
  - JSON format with request_id correlation
  - Log levels (DEBUG, INFO, WARNING, ERROR)
  - Request/response logging middleware
- **Metrics Collection**:
  - Prometheus metrics endpoint
  - Custom business metrics (orders, revenue, errors)
  - System metrics (response times, memory usage)
- **Basic Alerting**:
  - Health check failures
  - High error rates
  - Performance degradation
  - Slack webhook integration placeholder

### Security
- **Authentication**: 
  - JWT tokens with configurable expiration
  - Password validation with Django validators
  - Session-based auth for backward compatibility
- **API Security**:
  - DRF throttling for anonymous write operations
  - CORS configuration via environment variables
  - CSRF protection for session-based requests
- **Environment Security**:
  - `.env.example` with all required variables
  - Production security settings (ALLOWED_HOSTS, SECURE_SSL_REDIRECT)
  - Secret key management

### Documentation
- **README Files**: 
  - Root README with architecture overview
  - Backend README with API documentation
  - Local development setup instructions
  - Docker and CI/CD usage
  - Deployment instructions
- **API Documentation**: 
  - OpenAPI/Swagger documentation
  - Endpoint examples and schemas
  - Authentication requirements

## C) Deliverables Checklist

### Core Deliverables
- [ ] `AUDIT_REPORT.md` with endpoint mapping and gap analysis
- [ ] `docs/IMPLEMENTATION_PLAN.md` (this file)
- [ ] Dockerized backend + compose up working; `/health` returns 200 OK
- [ ] OpenAPI documentation at `/api/docs` renders correctly
- [ ] CI pipeline green: lint + tests + coverage report ≥70%
- [ ] Seed data command (`manage.py seed_demo`) with 3 categories, 20 products, demo users
- [ ] Free-tier deployment notes and deploy.yml placeholders
- [ ] Harvard-style references section placeholder for report
- [ ] Screenshot capture list for setup validation

### API Contract Fixes
- [ ] **Pagination Wrapper**: DRF-compatible pagination serializer
- [ ] **Brand Field**: Product model migration with brand field
- [ ] **Price Serialization**: Standardized decimal handling as strings
- [ ] **Image URL Helper**: Full URL construction in serializers
- [ ] **Type Consistency**: ID fields as strings, consistent data types

### Testing & Quality
- [ ] **Backend Tests**: pytest + factory_boy with 70%+ coverage
- [ ] **Frontend Tests**: Vitest + RTL for critical flows
- [ ] **API Integration Tests**: End-to-end API testing
- [ ] **Pre-commit Hooks**: black, isort, flake8, ESLint
- [ ] **Code Quality**: All new code follows style guidelines

### Deployment & Monitoring
- [ ] **Health Endpoints**: `/health` and `/metrics` working
- [ ] **Structured Logging**: JSON logs with request correlation
- [ ] **Environment Config**: Complete `.env.example` with all variables
- [ ] **Security Hardening**: Production-ready security settings
- [ ] **Deployment Scripts**: Makefile or scripts for common operations

### Documentation & Evidence
- [ ] **Setup Screenshots**: Docker compose up, health checks, API docs
- [ ] **CI Screenshots**: GitHub Actions successful run with coverage
- [ ] **Feature Screenshots**: Admin dashboard, product listing, cart/checkout
- [ ] **Deployment Screenshots**: Live deployment on free-tier platform
- [ ] **Reflection Notes**: What went well/wrong, lessons learned

## Implementation Priority

### Phase 1: Core API Fixes (High Priority)
1. Fix API contract mismatches (pagination, types, brand field)
2. Add missing endpoints (/health, /metrics, /api/docs)
3. Implement proper error handling and validation

### Phase 2: Testing Infrastructure (High Priority)
1. Set up pytest + factory_boy for backend testing
2. Add Vitest + RTL for frontend testing
3. Implement CI/CD pipeline with GitHub Actions

### Phase 3: DevOps & Monitoring (Medium Priority)
1. Enhance Docker setup with multi-stage builds
2. Add structured logging and metrics collection
3. Implement security hardening

### Phase 4: Documentation & Deployment (Medium Priority)
1. Complete documentation and README updates
2. Set up free-tier deployment configuration
3. Capture evidence screenshots and create reflection notes

## Success Criteria

- [ ] All API endpoints return consistent, well-documented responses
- [ ] Frontend and backend communicate without data type mismatches
- [ ] CI pipeline runs successfully with ≥70% test coverage
- [ ] Application deploys successfully on free-tier platform
- [ ] Health checks and monitoring endpoints are functional
- [ ] Documentation is complete and accurate
- [ ] All deliverables are committed and ready for review
