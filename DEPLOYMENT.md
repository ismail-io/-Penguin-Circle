# Deployment Guide

## Production Deployment Options

### 1. Full Stack on Heroku

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git installed
- MongoDB Atlas account (free tier available)

#### Steps

**1. Create Heroku Apps**
```bash
# Create backend app
heroku create your-app-backend
# Creates: your-app-backend.herokuapp.com

# Create frontend app
heroku create your-app-frontend
# Creates: your-app-frontend.herokuapp.com
```

**2. Setup MongoDB Atlas**
- Go to mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update backend .env

**3. Configure Backend**
```bash
cd backend

# Login to Heroku
heroku login

# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/community-connection"
heroku config:set JWT_SECRET="your-production-secret-key"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

**4. Configure Frontend**
```bash
cd frontend

# Update API URL in .env
echo REACT_APP_API_URL=https://your-app-backend.herokuapp.com > .env

# Build
npm run build

# Update package.json scripts
# Add: "postbuild": "echo '{ \"version\": \"0.1\" }' > build/version.json"

# Deploy
git push heroku main
```

### 2. Deploy to AWS

#### Using Elastic Beanstalk for Backend

```bash
# Install AWS CLI
pip install awsebcli

# Initialize EB
eb init -p node.js-14

# Create environment
eb create production

# Set environment variables
eb setenv MONGODB_URI="..." JWT_SECRET="..." JWT_EXPIRE="7d" NODE_ENV="production"

# Deploy
eb deploy
```

#### Using S3 + CloudFront for Frontend

```bash
# Build frontend
npm run build

# Create S3 bucket
aws s3 mb s3://your-app-frontend

# Upload files
aws s3 sync build/ s3://your-app-frontend

# Create CloudFront distribution
# (Use AWS Console for easier setup)
```

### 3. Deploy to DigitalOcean App Platform

#### Backend Deployment

1. Push code to GitHub
2. Go to DigitalOcean Console
3. Create App → Connect GitHub repo
4. Select `backend` folder
5. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```
6. Deploy

#### Frontend Deployment

1. Push code to GitHub
2. Build locally or use build script
3. Deploy to DigitalOcean App Platform
4. Or deploy to DigitalOcean Spaces (similar to S3)

### 4. Deploy to Vercel & Railway

#### Frontend on Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
vercel env add REACT_APP_API_URL https://your-backend-url
```

#### Backend on Railway

1. Connect GitHub repo
2. Select `backend` folder
3. Add environment variables
4. Auto-deploys on push

### 5. Docker Deployment

#### Create Docker Images

**Backend Dockerfile**
```dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile**
```dockerfile
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Deploy with Docker Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://root:password@mongodb:27017/community-connection
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      REACT_APP_API_URL: http://backend:5000
    depends_on:
      - backend

volumes:
  mongo_data:
```

#### Run Docker Compose
```bash
docker-compose up -d
```

## Environment Variables for Production

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/community-connection?retryWrites=true&w=majority
JWT_SECRET=your-very-long-and-random-secret-key-min-32-chars
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-production-api-url.com
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Install certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Performance Optimization

### Backend Optimization
1. Enable gzip compression
2. Use connection pooling
3. Implement caching
4. Optimize database queries
5. Use CDN for static files

### Frontend Optimization
1. Minify and bundle code
2. Lazy load components
3. Optimize images
4. Use service workers
5. Enable gzip compression

### Database Optimization
1. Create indexes on frequently queried fields
2. Use projections to limit returned data
3. Implement pagination
4. Archive old data

## Monitoring & Logging

### Using PM2 for Process Management

```bash
npm install -g pm2

# Start app
pm2 start server.js --name "community-api"

# Monitor
pm2 monit

# Log
pm2 logs community-api

# Restart on file changes
pm2 watch
```

### Using Winston for Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('App started');
```

### Using CloudWatch with AWS

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm

# Configure and start
sudo systemctl start amazon-cloudwatch-agent
```

## Backup & Recovery

### MongoDB Backup

```bash
# Backup to file
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/community-connection" --out ./backup

# Backup to cloud (Atlas)
# Built-in snapshot feature in MongoDB Atlas
```

### Automated Backups

Use MongoDB Atlas:
1. Go to Backup section
2. Enable automatic backups
3. Configure retention policy

### Restore from Backup

```bash
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/community-connection" ./backup/community-connection
```

## Security Checklist

- [ ] Change default passwords
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Use environment variables for secrets
- [ ] Enable CORS for specific domains
- [ ] Implement rate limiting
- [ ] Set up DDoS protection
- [ ] Enable database encryption
- [ ] Set up regular backups
- [ ] Monitor and log all activities
- [ ] Use strong JWT secrets
- [ ] Keep dependencies updated
- [ ] Use API versioning
- [ ] Implement request validation
- [ ] Set up error handling

## CI/CD Pipeline Setup

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## Scaling Considerations

### Horizontal Scaling
1. Load balancer (Nginx, HAProxy)
2. Multiple backend instances
3. Database replication

### Vertical Scaling
1. Upgrade server resources
2. Optimize code and queries
3. Implement caching

### Database Scaling
1. Sharding for large datasets
2. Read replicas
3. Connection pooling

## Troubleshooting Production Issues

### App Not Starting
```bash
# Check logs
heroku logs --tail

# Check config
heroku config

# Restart
heroku restart
```

### Database Connection Issues
```bash
# Verify connection string
heroku config:get MONGODB_URI

# Check MongoDB status
# (In MongoDB Atlas console)
```

### Memory Issues
```bash
# Monitor memory
heroku dyno:type web standard-1x

# Upgrade dyno type
heroku dyno:type web professional
```

## Cost Optimization

- [ ] Use free tier services
- [ ] Close unused resources
- [ ] Schedule scaling
- [ ] Monitor data transfer
- [ ] Use spot instances
- [ ] Archive old data
- [ ] Consolidate services

## Health Checks

Add health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

Configure health checks in deployment platform:
```
Endpoint: /health
Interval: 30s
Timeout: 5s
```

## Post-Deployment

1. Verify all features work
2. Run smoke tests
3. Monitor performance
4. Check error logs
5. Set up alerts
6. Create maintenance page
7. Document deployment process
8. Train team

---

**Deployment Complete! 🚀**

For questions or issues, check your platform's documentation or contact support.
