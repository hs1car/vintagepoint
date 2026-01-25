# Rate Limiting Documentation

## نظام حماية APIs من الاستخدام المفرط

تم تطبيق Rate Limiting على جميع APIs لحماية النظام من:
- **الهجمات**: Brute force, DDoS
- **الاستخدام المفرط**: Scraping, Abuse
- **الأحمال الزائدة**: Server overload

---

## 📊 معدلات الحدود (Rate Limits)

### 1. **Authentication APIs** 🔐
- **المسار**: `/api/auth/login`
- **الحد**: 5 محاولات / 5 دقائق
- **الهدف**: منع هجمات brute force

### 2. **Upload APIs** 📤
- **المسار**: `/api/upload`
- **الحد**: 10 رفع ملف / 5 دقائق
- **الهدف**: منع استنزاف السيرفر

### 3. **Standard APIs** ⚡
- **المسارات**: `/api/inquiries`, `/api/notifications`, `/api/analytics/advanced`
- **الحد**: 30 طلب / دقيقة
- **الهدف**: حماية من الطلبات المتكررة

### 4. **Public Read APIs** 📖
- **المسارات**: `/api/cars`, `/api/parts`, `/api/analytics`
- **الحد**: 100 طلب / دقيقة
- **الهدف**: السماح بالاستخدام العادي مع الحماية

---

## 🛡️ ميزات الحماية

### ✅ **IP-Based Tracking**
- تتبع كل IP بشكل منفصل
- يعمل مع Proxy و Load Balancers
- يدعم `X-Forwarded-For` و `X-Real-IP`

### ✅ **In-Memory Storage**
- سريع جداً (لا يحتاج قاعدة بيانات)
- تنظيف تلقائي كل 10 دقائق
- لا يؤثر على الأداء

### ✅ **Response Headers**
يتم إرسال headers مع كل response:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1706140800
Retry-After: 45 (في حالة التجاوز)
```

### ✅ **Security Headers**
تم إضافة headers أمان إضافية:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 📋 API Response عند التجاوز

عند تجاوز الحد المسموح:

**Status Code**: `429 Too Many Requests`

**Response Body**:
```json
{
  "error": "تم تجاوز الحد المسموح من الطلبات",
  "message": "Too many requests. Please try again in 45 seconds.",
  "retryAfter": 45,
  "reset": 1706140800
}
```

**Headers**:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1706140800
Retry-After: 45
```

---

## 🔧 التخصيص

يمكن تعديل الحدود في `src/lib/rate-limit.ts`:

```typescript
export const RateLimitPresets = {
  STRICT: {
    limit: 5,
    windowSeconds: 60
  },
  STANDARD: {
    limit: 30,
    windowSeconds: 60
  },
  RELAXED: {
    limit: 100,
    windowSeconds: 60
  },
  UPLOAD: {
    limit: 10,
    windowSeconds: 300
  },
  AUTH: {
    limit: 5,
    windowSeconds: 300
  }
}
```

---

## 🧪 اختبار Rate Limiting

### طريقة الاختبار:

1. **اختبار Login API**:
```bash
# محاولة login 6 مرات بسرعة
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test","password":"test"}'
done
```

2. **اختبار Public API**:
```bash
# 101 طلب بسرعة
for i in {1..101}; do
  curl http://localhost:3000/api/cars
done
```

3. **التحقق من Headers**:
```bash
curl -I http://localhost:3000/api/cars
```

---

## 📈 المراقبة (Monitoring)

### Logs في Console:
```
[API] POST /api/auth/login - IP: 192.168.1.100
[API] GET /api/cars - IP: 192.168.1.101
```

### Upload Logs في ملف:
```
logs/uploads.log
```

---

## ⚠️ ملاحظات مهمة

1. **Development Mode**: في وضع التطوير، قد تحتاج لتعطيل rate limiting مؤقتاً
2. **Production**: في الإنتاج، يُنصح بإضافة Redis أو Memcached للتوزيع
3. **Load Balancers**: تأكد من تمرير IP الحقيقي عبر headers
4. **Testing**: استخدم IP مختلف أو انتظر انتهاء النافذة الزمنية

---

## 🚀 التحسينات المستقبلية

- [ ] دعم Redis للتخزين الموزع
- [ ] Dashboard للمراقبة الحية
- [ ] Whitelist لـ IPs موثوقة
- [ ] Dynamic rate limiting حسب المستخدم
- [ ] Alerts عند الهجمات

---

## 📚 المراجع

- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP Status 429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
