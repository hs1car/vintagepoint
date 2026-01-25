# 📋 مواصفات الموقع الكاملة | Complete Website Specifications

## 🏢 معلومات المشروع | Project Information

### اسم المشروع | Project Name
**Vintage Point L.L.C - Classic Cars & Spare Parts Platform**

### المطور | Developer
- **الشركة | Company:** HS Company - شركة إتش إس
- **المهندس | Engineer:** محمد حسين (Mohamed Hussein)
- **التخصص | Specialty:** Full-Stack Development & Modern Web Technologies

### نوع المشروع | Project Type
منصة ويب احترافية لعرض وإدارة السيارات الكلاسيكية الفاخرة وقطع الغيار الأصلية
Professional web platform for showcasing and managing luxury classic cars and genuine spare parts

---

## 🎯 الغرض من الموقع | Website Purpose

### الأهداف الرئيسية | Main Objectives
1. **عرض وبيع السيارات الكلاسيكية الفاخرة**
   - Display and sell luxury classic cars
   
2. **توفير قطع غيار أصلية للسيارات الكلاسيكية**
   - Provide genuine spare parts for classic cars
   
3. **تسهيل التواصل بين البائع والعملاء**
   - Facilitate communication between seller and customers
   
4. **إدارة احترافية للمحتوى والمخزون**
   - Professional content and inventory management

### الجمهور المستهدف | Target Audience
- عشاق السيارات الكلاسيكية في دبي والإمارات
- Classic car enthusiasts in Dubai and UAE
- المشترين المحتملين للسيارات الفاخرة
- Potential buyers of luxury vehicles
- أصحاب السيارات الكلاسيكية الباحثين عن قطع غيار أصلية
- Classic car owners looking for genuine spare parts

---

## 🏗️ البنية التقنية | Technical Architecture

### Frontend Technologies
```json
{
  "framework": "Next.js 16.1.4 (React 19)",
  "language": "TypeScript 5",
  "styling": "Tailwind CSS 4",
  "ui_library": "Shadcn UI + Radix UI",
  "animations": "Framer Motion 12.23.2",
  "state_management": "Zustand 5.0.6",
  "data_fetching": "TanStack React Query 5.82.0",
  "forms": "React Hook Form 7.60.0 + Zod 4.0.2",
  "icons": "Lucide React 0.525.0"
}
```

### Backend Technologies
```json
{
  "api": "Next.js API Routes (Serverless)",
  "database": "SQLite",
  "orm": "Prisma 6.11.1",
  "authentication": "NextAuth.js 4.24.11",
  "password_hashing": "bcryptjs 3.0.3",
  "image_optimization": "Sharp 0.34.3"
}
```

### Additional Features
```json
{
  "internationalization": "next-intl 4.3.4",
  "theme": "next-themes 0.4.6",
  "image_gallery": "yet-another-react-lightbox 3.28.0",
  "carousel": "embla-carousel-react 8.6.0",
  "notifications": "sonner 2.0.6",
  "drag_drop": "@dnd-kit packages",
  "charts": "recharts 2.15.4"
}
```

---

## 🗄️ هيكل قاعدة البيانات | Database Structure

### الجداول الرئيسية | Main Tables

#### 1. User & AdminUser
```prisma
- User: نظام المستخدمين العام
  • id (String, CUID)
  • email (String, Unique)
  • name (String, Optional)
  • password (String, Optional)
  • isAdmin (Boolean, default: false)
  • createdAt, updatedAt

- AdminUser: مستخدمي لوحة التحكم
  • id, email, password, name
  • createdAt, updatedAt
```

#### 2. Car (السيارات الكلاسيكية)
```prisma
- id (String, CUID)
- model (String) - موديل السيارة
- year (Int) - سنة الصنع
- condition (String) - الحالة (جديدة/مستعملة/كلاسيك)
- price (Float, Optional) - السعر
- description (String, Optional) - الوصف
- images (String, JSON) - مصفوفة من روابط الصور
- isActive (Boolean, default: true) - حالة النشر
- isFeatured (Boolean, default: false) - سيارة الأسبوع
- createdAt, updatedAt
- Relations: inquiries[], wishlists[]
```

#### 3. SparePart (قطع الغيار)
```prisma
- id (String, CUID)
- name (String) - اسم القطعة
- description (String, Optional) - الوصف
- price (Float) - السعر
- images (String, JSON) - مصفوفة الصور
- isActive (Boolean, default: true) - حالة النشر
- createdAt, updatedAt
```

#### 4. Inquiry (الاستفسارات)
```prisma
- id (String, CUID)
- carId (String, Optional) - معرف السيارة
- partId (String, Optional) - معرف قطعة الغيار
- name (String) - اسم المستفسر
- email (String, Optional) - البريد الإلكتروني
- phone (String) - رقم الهاتف
- message (String) - الرسالة
- createdAt (DateTime)
```

#### 5. Wishlist (قائمة الأمنيات)
```prisma
- id (String, CUID)
- userId (String, Optional) - للمستخدمين المسجلين
- sessionId (String, Optional) - للزوار
- carId (String) - معرف السيارة
- createdAt (DateTime)
- Unique constraints: (sessionId, carId), (userId, carId)
```

#### 6. Analytics (التحليلات)
```prisma
- PageView:
  • id, page, entityType, entityId
  • ipAddress, userAgent, referrer
  • createdAt
  • Indexes: entityType+entityId, page, createdAt

- AnalyticsEvent:
  • id, eventType (view/click/inquiry/wishlist_add)
  • entityType (car/part), entityId
  • metadata (JSON), ipAddress
  • createdAt
  • Indexes: eventType, entityType+entityId, createdAt
```

#### 7. SiteSettings (إعدادات الموقع)
```prisma
- id (String, CUID)
- logoUrl (String, Optional) - رابط الشعار
- createdAt, updatedAt
```

---

## 📱 الصفحات والمميزات | Pages & Features

### الصفحات العامة | Public Pages

#### 1. الصفحة الرئيسية | Home Page (`/`)
**المميزات:**
- عرض السيارات الكلاسيكية النشطة
- عرض قطع الغيار المتوفرة
- نظام تصنيف وفلترة متقدم
- معرض صور قابل للتنقل مع مؤشر الصور
- زر الإضافة لقائمة الأمنيات
- زر واتساب للتواصل المباشر
- إحصائيات المشاهدة لكل سيارة وقطعة
- نظام تتبع المشاهدات (Analytics)

**التفاصيل التقنية:**
- Client-side rendering مع Server Components
- Auto-tracking للمشاهدات عبر `/api/analytics/track`
- Image optimization مع Next.js Image
- Lazy loading للصور
- Responsive design

#### 2. صفحة السيارات | Cars Page (`/cars/[id]`)
**المميزات:**
- عرض تفاصيل السيارة الكاملة
- معرض صور احترافي
- معلومات السيارة (الموديل، السنة، الحالة، السعر)
- وصف تفصيلي
- زر واتساب للاستفسار
- سيارات مشابهة
- تتبع مشاهدات السيارة

#### 3. صفحة قطع الغيار | Parts Page (`/parts/[id]`)
**المميزات:**
- عرض تفاصيل القطعة
- معرض الصور
- السعر والوصف
- زر التواصل عبر واتساب
- قطع غيار مشابهة

#### 4. من نحن | About Page (`/about`)
**المحتوى:**
- مرحباً بكم في Vintage Point L.L.C
- لماذا تختار Vintage Point؟
- رؤيتنا ومهمتنا وقيمنا
- معلومات الشركة
- بيانات التواصل

#### 5. قائمة الأمنيات | Wishlist Page (`/wishlist`)
**المميزات:**
- عرض السيارات المحفوظة
- إزالة من القائمة
- التواصل عبر واتساب
- دعم الزوار والمستخدمين المسجلين

#### 6. دليل الشراء | Buying Guide (`/buying-guide`)
**المحتوى:**
- نصائح شراء السيارات الكلاسيكية
- معايير الجودة
- كيفية الفحص
- نصائح الصيانة

---

### لوحة التحكم | Admin Dashboard

#### مسار الدخول: `/admin`

#### 1. صفحة تسجيل الدخول | Login (`/admin/login`)
**المميزات:**
- نظام مصادقة آمن
- Bcrypt password hashing
- NextAuth.js session management
- توجيه تلقائي للوحة التحكم

#### 2. لوحة التحكم الرئيسية | Dashboard (`/admin/dashboard`)
**الإحصائيات المعروضة:**
- إجمالي السيارات
- إجمالي قطع الغيار
- إجمالي الاستفسارات
- روابط سريعة للأقسام

**الأقسام الفرعية:**
- إدارة السيارات
- إدارة قطع الغيار
- التحليلات
- الاستفسارات
- الإعدادات

#### 3. إدارة السيارات | Cars Management (`/admin/cars`)
**الوظائف:**
- عرض جميع السيارات (نشطة + معطلة)
- إضافة سيارة جديدة
- تعديل تفاصيل السيارة
- حذف السيارة
- تفعيل/تعطيل النشر
- تحديد سيارة الأسبوع (Featured)
- رفع صور متعددة (Drag & Drop)
- معاينة الصور
- إعادة ترتيب الصور

**نظام رفع الصور:**
- Drag and drop interface
- Multiple file upload
- Image preview
- Delete uploaded images
- Sortable images with @dnd-kit

#### 4. إدارة قطع الغيار | Parts Management (`/admin/parts`)
**الوظائف:**
- عرض جميع القطع
- إضافة قطعة جديدة
- تعديل القطعة
- حذف القطعة
- تفعيل/تعطيل
- رفع الصور
- إدارة الأسعار

#### 5. التحليلات | Analytics Dashboard (`/admin/analytics`)
**المميزات الرئيسية:**

**التحديث التلقائي:**
- Auto-refresh كل 30 ثانية
- Real-time data updates

**الإحصائيات المعروضة:**
- إجمالي عدد الزوار
- المشاهدات اليومية
- إجمالي مشاهدات السيارات
- إجمالي مشاهدات قطع الغيار

**الرسوم البيانية:**
- مشاهدات آخر 7 أيام (Line Chart)
- تحليل يومي للزوار
- إحصائيات ساعية

**الجداول التحليلية:**
1. **أكثر السيارات مشاهدة:**
   - الموديل والسنة
   - عدد المشاهدات
   - رابط مباشر للسيارة

2. **أكثر قطع الغيار مشاهدة:**
   - اسم القطعة
   - عدد المشاهدات
   - رابط مباشر

3. **أكثر الصفحات زيارة:**
   - اسم الصفحة
   - عدد الزيارات

**التصدير:**
- Export data to CSV/Excel
- تقارير مفصلة

#### 6. الاستفسارات | Inquiries (`/admin/inquiries`)
**المميزات:**
- عرض جميع الاستفسارات
- تفاصيل المستفسر (الاسم، البريد، الهاتف)
- الرسالة الكاملة
- السيارة أو القطعة المستفسر عنها
- التاريخ والوقت
- حذف الاستفسار
- التواصل المباشر

#### 7. الإعدادات | Settings (`/admin/settings`)
**الإعدادات المتاحة:**
- رفع شعار الموقع
- تحديث معلومات الشركة
- إعدادات واتساب
- إعدادات التواصل
- إعدادات SEO

---

## 🌍 اللغات المدعومة | Supported Languages

### نظام متعدد اللغات | Multi-Language System

**اللغات:**
1. **العربية (Arabic)** - ar
2. **الإنجليزية (English)** - en
3. **الأوردو (Urdu)** - ur
4. **الهندية (Hindi)** - hi
5. **الروسية (Russian)** - ru

**المميزات:**
- RTL support للعربية والأوردو
- LTR support للإنجليزية والهندية والروسية
- Context-based language switching
- Persistent language preference
- Translation files في `/src/locales/`

**ملفات الترجمة:**
```
src/locales/
  ├── ar.json (عربي)
  ├── en.json (English)
  ├── ur.json (اردو)
  ├── hi.json (हिंदी)
  └── ru.json (Русский)
```

---

## 🎨 التصميم والواجهة | Design & UI

### نظام التصميم | Design System

**الألوان الرئيسية:**
```css
- Primary Gold: #D4AF37 (لون ذهبي فاخر)
- Secondary: متدرجات من الرمادي والأسود
- Background: أبيض نقي مع ظلال خفيفة
- Text: أسود وأبيض حسب الخلفية
```

**الخطوط:**
- نظام خطوط Next.js (Inter للإنجليزية)
- دعم الخطوط العربية
- Font optimization

**المكونات الجاهزة (Shadcn UI):**
- Button, Card, Dialog, Dropdown
- Form, Input, Select, Textarea
- Table, Tabs, Toast, Alert
- Carousel, Accordion, Sheet
- Badge, Avatar, Separator
- Progress, Slider, Switch
- Skeleton loaders
- وأكثر من 50+ مكون

### التجربة البصرية | Visual Experience

**الرسوم المتحركة:**
- Framer Motion للتحولات السلسة
- Smooth page transitions
- Hover effects احترافية
- Loading animations

**الاستجابة:**
- Mobile-first design
- Tablet optimization
- Desktop enhancement
- 4K support

---

## 🔧 المميزات التقنية المتقدمة | Advanced Technical Features

### 1. نظام التحليلات | Analytics System

**التتبع التلقائي:**
```javascript
// تتبع المشاهدات
POST /api/analytics/track
Body: {
  page: string,
  entityType?: "car" | "part",
  entityId?: string
}
```

**البيانات المجمعة:**
- IP Address
- User Agent
- Referrer
- Timestamp
- Page path
- Entity type & ID

**الإحصائيات:**
- Daily visitors count
- Page views per entity
- Most viewed cars/parts
- Popular pages
- Time-based analytics

### 2. نظام رفع الصور | Image Upload System

**المميزات:**
- Multiple file upload
- Drag & drop interface
- Image preview before upload
- Client-side validation
- Size restrictions (5MB max)
- Format validation (jpg, png, webp)
- Server-side processing
- Automatic optimization

**API Endpoints:**
```
POST /api/upload - رفع صورة واحدة
DELETE /api/upload?filename=xyz - حذف صورة
```

**التخزين:**
```
public/uploads/
  ├── cars/
  └── parts/
```

### 3. نظام الأمان | Security System

**المصادقة:**
- NextAuth.js session management
- Bcrypt password hashing (10 rounds)
- HTTP-only cookies
- CSRF protection

**حماية API:**
- Admin-only routes verification
- Rate limiting (planned)
- Input validation with Zod
- SQL injection prevention (Prisma ORM)

### 4. تحسين الأداء | Performance Optimization

**Next.js Optimizations:**
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization (Sharp)
- Code splitting
- Lazy loading
- Prefetching

**Database Optimization:**
- Indexed queries
- Connection pooling
- Efficient relations
- Selective field retrieval

### 5. Progressive Web App (PWA)

**الملفات:**
```
public/
  ├── manifest.json - تكوين PWA
  ├── sw.js - Service Worker
  ├── offline.html - صفحة بدون اتصال
```

**المميزات:**
- Install to home screen
- Offline support
- Push notifications (planned)
- App-like experience

---

## 📡 واجهات برمجة التطبيقات | API Endpoints

### Public APIs

#### السيارات | Cars
```
GET  /api/cars - جلب جميع السيارات النشطة
GET  /api/cars?includeInactive=true - مع المعطلة (Admin)
GET  /api/cars/[id] - تفاصيل سيارة
POST /api/cars - إضافة سيارة جديدة (Admin)
PUT  /api/cars/[id] - تحديث سيارة (Admin)
DELETE /api/cars/[id] - حذف سيارة (Admin)
```

#### قطع الغيار | Parts
```
GET  /api/parts - جلب جميع القطع النشطة
GET  /api/parts?includeInactive=true - مع المعطلة (Admin)
GET  /api/parts/[id] - تفاصيل قطعة
POST /api/parts - إضافة قطعة (Admin)
PUT  /api/parts/[id] - تحديث قطعة (Admin)
DELETE /api/parts/[id] - حذف قطعة (Admin)
```

#### الاستفسارات | Inquiries
```
GET  /api/inquiries - جلب جميع الاستفسارات (Admin)
POST /api/inquiries - إرسال استفسار جديد
DELETE /api/inquiries/[id] - حذف استفسار (Admin)
```

#### المصادقة | Authentication
```
POST /api/auth/login - تسجيل دخول
POST /api/auth/logout - تسجيل خروج
GET  /api/auth/session - جلب الجلسة الحالية
```

#### التحليلات | Analytics
```
POST /api/analytics/track - تتبع مشاهدة
GET  /api/analytics - جلب الإحصائيات (Admin)
GET  /api/analytics/dashboard - بيانات لوحة التحليلات
```

#### الإعدادات | Settings
```
GET  /api/settings - جلب الإعدادات
POST /api/settings - تحديث الإعدادات (Admin)
```

#### رفع الملفات | Upload
```
POST /api/upload - رفع صورة
DELETE /api/upload?filename=xyz - حذف صورة
```

---

## 🚀 النشر والاستضافة | Deployment & Hosting

### منصات النشر المدعومة | Supported Platforms

**1. Vercel (موصى به)**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Serverless functions
- Environment variables

**2. Netlify**
- netlify.toml configuration included
- Build commands configured
- Redirects setup

**3. Self-Hosted**
- Standalone server mode
- Node.js server
- SQLite database included

### متطلبات البيئة | Environment Requirements

**Node.js:**
- Version: 18.x or higher
- Package manager: npm, yarn, pnpm, or bun

**البيئة المتغيرة | Environment Variables:**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="971569141444"

# Admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"
```

### أوامر البناء | Build Commands

**Development:**
```bash
npm run dev          # تشغيل محلي
npm run db:push      # رفع schema للقاعدة
npm run db:seed      # ملء البيانات الأولية
```

**Production:**
```bash
npm run build        # بناء المشروع
npm run start        # تشغيل production
```

**Database:**
```bash
npm run db:generate  # توليد Prisma Client
npm run db:migrate   # تشغيل migrations
npm run db:reset     # إعادة تعيين القاعدة
```

---

## 📊 قياس الأداء | Performance Metrics

### مؤشرات الأداء المستهدفة | Target Performance Indicators

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Page Speed:**
- Mobile: 90+
- Desktop: 95+

**SEO Score:**
- 90+ على Google PageSpeed Insights

---

## 📱 الميزات المتقدمة | Advanced Features

### 1. قائمة الأمنيات | Wishlist System
- دعم الزوار (عبر sessionId)
- دعم المستخدمين المسجلين
- Persistent storage
- Sync across devices (logged users)

### 2. زر واتساب عائم | Floating WhatsApp
- موقع ثابت في الزاوية
- رسائل مخصصة حسب المنتج
- رابط مباشر للمحادثة

### 3. عداد المشاهدات | View Counter
- تتبع لكل سيارة وقطعة
- عرض العدد للمستخدمين
- تحليلات للإدارة

### 4. السيارة المميزة | Featured Car
- "Car of the Week"
- عرض بارز في الصفحة الرئيسية
- تحديث من لوحة التحكم

### 5. رأس ذكي | Smart Header
- يختفي عند التمرير لأسفل
- يظهر عند التمرير لأعلى
- توفير مساحة شاشة

### 6. معرض الصور | Image Gallery
- Navigation arrows
- Image indicators
- Zoom support
- Lightbox view
- Smooth transitions

---

## 🔐 الأمان والخصوصية | Security & Privacy

### إجراءات الأمان | Security Measures

**1. كلمات المرور:**
- Bcrypt hashing (10 rounds)
- Salted passwords
- No plain text storage

**2. الجلسات:**
- HTTP-only cookies
- Secure flag in production
- Session expiration
- CSRF tokens

**3. التحقق من الصلاحيات:**
- Admin route protection
- API endpoint guards
- Role-based access

**4. البيانات:**
- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection
- Content Security Policy

**5. الملفات:**
- File type validation
- Size restrictions
- Secure upload path
- No executable files

---

## 📈 خطط التطوير المستقبلية | Future Development Plans

### المميزات المقترحة | Proposed Features

**المرحلة 1 (قريباً):**
- [ ] نظام تقييمات العملاء
- [ ] مقارنة السيارات
- [ ] البحث المتقدم بالفلاتر
- [ ] نظام الإشعارات

**المرحلة 2:**
- [ ] نظام الدفع الإلكتروني
- [ ] حجوزات المعاينة
- [ ] Live chat support
- [ ] تطبيق الموبايل

**المرحلة 3:**
- [ ] AI recommendations
- [ ] Virtual showroom (3D)
- [ ] Augmented Reality
- [ ] Blockchain verification

---

## 📞 معلومات التواصل | Contact Information

### بيانات الشركة | Company Details

**Vintage Point L.L.C**
- **الموقع | Location:** Dubai, UAE
- **واتساب | WhatsApp:** +971 56 914 1444
- **البريد | Email:** info@vintagepoint.ae
- **الموقع | Website:** www.vintagepoint.ae

### فريق التطوير | Development Team

**HS Company - شركة إتش إس**
- **المطور الرئيسي | Lead Developer:** محمد حسين
- **التخصص | Specialization:** Full-Stack Development
- **التقنيات | Technologies:** Next.js, React, TypeScript, Node.js

---

## 📝 ملاحظات إضافية | Additional Notes

### البيانات الأولية | Initial Data
- يمكن ملء القاعدة ببيانات تجريبية عبر:
  ```bash
  npm run db:seed
  ```
- يتضمن سيارات كلاسيكية نموذجية
- قطع غيار عينة
- حساب أدمن افتراضي

### الصيانة | Maintenance
- نظام backup تلقائي
- سكريبت صيانة (maintenance.ps1)
- Logging system
- Error tracking

### الوثائق | Documentation
- README.md شامل
- JSDoc comments
- TypeScript types
- API documentation inline

---

## 🎯 الخلاصة | Summary

هذا الموقع هو منصة احترافية متكاملة لعرض وبيع السيارات الكلاسيكية وقطع الغيار، مبني بأحدث التقنيات ويوفر:

- ✅ تجربة مستخدم استثنائية
- ✅ لوحة تحكم قوية وسهلة
- ✅ نظام تحليلات متقدم
- ✅ دعم 5 لغات
- ✅ أمان عالي
- ✅ أداء ممتاز
- ✅ تصميم احترافي
- ✅ SEO محسّن
- ✅ PWA ready

**تم التطوير بواسطة: محمد حسين - HS Company**

---

*آخر تحديث: 25 يناير 2026*
