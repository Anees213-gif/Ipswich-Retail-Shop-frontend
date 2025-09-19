# Deployment Guide - Free-Tier Platforms

This guide covers deploying the Ipswich Retail e-commerce application to free-tier platforms including Render, Railway, and PythonAnywhere.

## Platform Comparison

| Platform | Free Tier Limits | Database | Build Time | Best For |
|----------|------------------|----------|------------|----------|
| **Render** | 750 hours/month, 512MB RAM | PostgreSQL (free) | 90 min/month | Full-stack apps |
| **Railway** | $5 credit/month | PostgreSQL (free) | Unlimited | Docker apps |
| **PythonAnywhere** | 1 web app, 512MB RAM | MySQL (free) | Limited | Python apps |

## Render Deployment

### 1. Create Services

#### Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ipswich-retail-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn ipswich_retail.wsgi:application`
   - **Instance Type**: Free

#### Frontend Service
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ipswich-retail-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

#### Database Service
1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `ipswich-retail-db`
   - **Database**: `ipswich_retail`
   - **User**: `ipswich_retail_user`

### 2. Environment Variables

#### Backend Environment Variables
```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-backend-url.onrender.com
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
```

#### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 3. Deploy Commands
```bash
# Backend deployment
git push origin main

# Frontend deployment  
git push origin main
```

### 4. Post-Deployment Setup
```bash
# Run migrations
render run --service your-backend-service python manage.py migrate

# Load sample data
render run --service your-backend-service python manage.py seed_demo

# Create admin user
render run --service your-backend-service python manage.py createsuperuser
```

## Railway Deployment

### 1. Create Project
1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository

### 2. Configure Services

#### Backend Service
1. Add service → "GitHub Repo"
2. Select backend folder
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn ipswich_retail.wsgi:application`
   - **Health Check Path**: `/health`

#### Frontend Service
1. Add service → "GitHub Repo"
2. Select frontend folder
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l 3000`

#### Database Service
1. Add service → "PostgreSQL"
2. Railway automatically provisions database

### 3. Environment Variables
Railway automatically provides `DATABASE_URL`. Add:
```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend-url.railway.app
```

### 4. Deploy
```bash
git push origin main
```

## PythonAnywhere Deployment

### 1. Create Account
1. Go to [PythonAnywhere](https://www.pythonanywhere.com)
2. Create free account
3. Verify email address

### 2. Setup Backend
1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Manual configuration" → "Python 3.10"
4. Configure:
   - **Source code**: Upload or clone from GitHub
   - **Working directory**: `/home/yourusername/ipswich-retail/backend`
   - **WSGI file**: `/home/yourusername/ipswich-retail/backend/ipswich_retail/wsgi.py`

### 3. Install Dependencies
```bash
# In PythonAnywhere console
pip3.10 install --user -r requirements.txt
```

### 4. Configure Database
1. Go to "Databases" tab
2. Create MySQL database
3. Update settings.py:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'yourusername$ipswich_retail',
        'USER': 'yourusername',
        'PASSWORD': 'your-password',
        'HOST': 'yourusername.mysql.pythonanywhere-services.com',
    }
}
```

### 5. Environment Variables
```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com
```

## Health Check Configuration

### Backend Health Check
All platforms should use `/health` endpoint:
```python
# In your Django settings
HEALTH_CHECK_PATH = '/health'
```

### Frontend Health Check
Use root path `/` for frontend health checks.

## CORS Configuration

### Production CORS Settings
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-url.onrender.com",
    "https://your-frontend-url.railway.app",
    "https://yourusername.pythonanywhere.com",
]

CORS_ALLOW_CREDENTIALS = True
```

## SSL/HTTPS Configuration

### Render
- Automatic HTTPS with custom domains
- Force HTTPS redirect enabled

### Railway
- Automatic HTTPS with custom domains
- Force HTTPS redirect enabled

### PythonAnywhere
- HTTPS available on custom domains
- Free accounts get `yourusername.pythonanywhere.com` with HTTPS

## Monitoring & Logs

### Render
- Built-in logging dashboard
- Real-time logs in dashboard
- Error tracking and alerts

### Railway
- Built-in logging and metrics
- Real-time logs in dashboard
- Performance monitoring

### PythonAnywhere
- Basic logging in dashboard
- Error logs accessible
- Limited monitoring features

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
# Ensure all dependencies are in requirements.txt
# Verify Python version compatibility
```

#### Database Connection Issues
```bash
# Verify DATABASE_URL format
# Check database service is running
# Ensure migrations are applied
```

#### CORS Issues
```bash
# Verify CORS_ALLOWED_ORIGINS includes frontend URL
# Check CORS_ALLOW_CREDENTIALS is True
# Ensure frontend is making requests to correct backend URL
```

#### Static Files Issues
```bash
# Run collectstatic command
python manage.py collectstatic --noinput

# Verify STATIC_URL and STATIC_ROOT settings
```

### Debug Mode
For debugging, temporarily set:
```env
DEBUG=True
ALLOWED_HOSTS=*
```

## Deployment Screenshots

### 1. Service Creation
**File**: `screenshots/deploy-service-creation.png`
**Description**: Platform dashboard showing service creation process

### 2. Environment Variables
**File**: `screenshots/deploy-env-vars.png`
**Description**: Environment variables configuration screen

### 3. Build Logs
**File**: `screenshots/deploy-build-logs.png`
**Description**: Successful build logs showing no errors

### 4. Health Check
**File**: `screenshots/deploy-health-check.png`
**Description**: Health check endpoint returning 200 OK

### 5. Live Application
**File**: `screenshots/deploy-live-app.png`
**Description**: Live application running on production URL

### 6. Database Migration
**File**: `screenshots/deploy-migration.png`
**Description**: Successful database migration and seed data

## Performance Optimization

### Backend Optimization
- Enable gzip compression
- Use CDN for static files
- Implement caching strategies
- Optimize database queries

### Frontend Optimization
- Enable gzip compression
- Use CDN for assets
- Implement lazy loading
- Optimize images

### Database Optimization
- Add database indexes
- Use connection pooling
- Implement query optimization
- Regular database maintenance

## Security Considerations

### Production Security
- Use strong SECRET_KEY
- Enable HTTPS only
- Configure proper CORS
- Implement rate limiting
- Regular security updates

### Environment Security
- Never commit secrets to repository
- Use environment variables for all sensitive data
- Implement proper access controls
- Regular security audits

## Cost Optimization

### Free Tier Limits
- Monitor usage against limits
- Optimize resource usage
- Use caching to reduce database calls
- Implement efficient pagination
- Regular cleanup of old data

### Upgrade Considerations
- Monitor performance metrics
- Plan for scaling needs
- Consider paid tiers for production
- Implement monitoring and alerting
