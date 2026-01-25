# Production Deployment Checklist

## 🔴 Critical (Must Complete)

### Database
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Run `npx prisma migrate deploy` in production
- [ ] Set up database backups (daily minimum)
- [ ] Configure connection pooling
- [ ] Set `DATABASE_URL` with SSL: `?sslmode=require`

### Environment Variables
- [ ] Generate strong `SESSION_SECRET` (32+ chars)
- [ ] Generate strong `CSRF_SECRET` (32+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Verify all required env vars with `npm run build`

### Security
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS properly
- [ ] Review and test CSRF protection
- [ ] Implement rate limiting on all public APIs
- [ ] Remove all `console.log` from production code
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)

### Performance
- [ ] Enable CDN for static assets
- [ ] Configure image optimization
- [ ] Test page load times (<3s target)
- [ ] Enable compression (gzip/brotli)
- [ ] Implement proper caching headers

## 🟡 Important (Highly Recommended)

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Create `/api/health` endpoint monitoring
- [ ] Set up performance monitoring (New Relic, Datadog)

### Backup & Recovery
- [ ] Automated database backups
- [ ] Test restore procedures
- [ ] Document recovery process
- [ ] Set up file upload backups

### Testing
- [ ] Load testing (Apache Bench, k6)
- [ ] Security testing (OWASP ZAP)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] API endpoint testing

## 🟢 Optional (Nice to Have)

### Infrastructure
- [ ] Set up staging environment
- [ ] Configure auto-scaling
- [ ] Implement blue-green deployment
- [ ] Set up Docker containers
- [ ] Configure CI/CD pipeline

### Features
- [ ] Implement search indexing
- [ ] Add sitemap.xml generation
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Implement A/B testing
- [ ] Add internationalization (i18n)

## Pre-Deployment Commands

```bash
# 1. Install dependencies
npm ci

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate deploy

# 4. Build production bundle
npm run build

# 5. Test build locally
npm start

# 6. Run health check
curl http://localhost:3000/api/health
```

## Post-Deployment Verification

```bash
# Check site is live
curl -I https://vintagepoint.ae

# Test API endpoints
curl https://vintagepoint.ae/api/health
curl https://vintagepoint.ae/api/cars

# Check database connection
npx prisma studio

# Monitor logs
tail -f logs/*.log

# Test admin login
# Open: https://vintagepoint.ae/admin/login
```

## Environment-Specific Settings

### Development
```env
NODE_ENV=development
DATABASE_URL="postgresql://localhost:5432/vintagepoint_dev"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Staging
```env
NODE_ENV=production
DATABASE_URL="postgresql://staging_db:5432/vintagepoint_staging?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://staging.vintagepoint.ae"
```

### Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://prod_db:5432/vintagepoint?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://vintagepoint.ae"
SESSION_SECRET="<generated-secret>"
CSRF_SECRET="<generated-secret>"
```

## Security Headers Verification

Use https://securityheaders.com to verify:
- [x] X-Frame-Options
- [x] X-Content-Type-Options
- [x] X-XSS-Protection
- [x] Strict-Transport-Security (HSTS)
- [x] Content-Security-Policy
- [x] Referrer-Policy
- [x] Permissions-Policy

## Performance Benchmarks

Target metrics:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

Test with:
- Google PageSpeed Insights
- WebPageTest
- Lighthouse (Chrome DevTools)

## Rollback Plan

If deployment fails:
```bash
# 1. Revert to previous version
git revert HEAD

# 2. Rebuild
npm run build

# 3. Redeploy
npm start

# 4. Verify health
curl http://localhost:3000/api/health
```

## Support Contacts

- **Developer**: [Your Name]
- **Hosting**: [Hosting Provider]
- **Domain**: [Domain Registrar]
- **Database**: [Database Provider]

## Last Updated
Date: 2026-01-25
Version: 1.0.0
