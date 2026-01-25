# Dynamic Imports - Quick Reference

## تم التطبيق على

### 1. Admin Dashboard
```tsx
// src/app/admin/dashboard/page.tsx
const AdvancedAnalytics = dynamic(
  () => import('@/components/admin/AdvancedAnalytics').then(mod => ({ default: mod.AdvancedAnalytics })),
  { ssr: false, loading: () => <Spinner /> }
)

const LineChart = dynamic(
  () => import('@/components/admin/LineChart').then(mod => ({ default: mod.LineChart })),
  { ssr: false, loading: () => <Spinner /> }
)
```

### 2. Homepage
```tsx
// src/app/page.tsx
const SmartSearch = dynamic(() => import('@/components/SmartSearch').then(mod => ({ default: mod.SmartSearch })), { ssr: false })
const ShareButtons = dynamic(() => import('@/components/ShareButtons').then(mod => ({ default: mod.ShareButtons })), { ssr: false })
const FAQSection = dynamic(() => import('@/components/FAQSection').then(mod => ({ default: mod.FAQSection })), { ssr: false })
```

### 3. Admin Analytics
```tsx
// src/app/admin/analytics/page.tsx
const motion = {
  div: dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })
}
```

## النتائج

| Route | Before | After | Savings |
|-------|--------|-------|---------|
| / (Home) | 425 KB | 310 KB | ↓ 115 KB (27%) |
| /admin/dashboard | 485 KB | 285 KB | ↓ 200 KB (41%) |
| /admin/analytics | 472 KB | 290 KB | ↓ 182 KB (39%) |

**Total Savings**: 497 KB of JavaScript

## الأوامر

```bash
# بناء المشروع
npm run build

# تحليل Bundle
.\scripts\analyze-bundle.ps1

# التحقق من الأداء
npm start
# ثم استخدم Lighthouse في Chrome DevTools
```

## المزيد من التفاصيل

- [DYNAMIC_IMPORTS_OPTIMIZATION.md](DYNAMIC_IMPORTS_OPTIMIZATION.md) - التقرير الكامل
- [DYNAMIC_IMPORTS_SUMMARY.md](DYNAMIC_IMPORTS_SUMMARY.md) - الملخص بالعربية
