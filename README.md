# 🚗 Classic Cars & Spare Parts - Luxury Automotive Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**منصة احترافية لعرض وإدارة السيارات الكلاسيكية وقطع الغيار**

**Professional Platform for Classic Cars & Genuine Spare Parts**

</div>

---

## 🏢 المطور | Developer

<div align="center">

### **HS Company** - شركة إتش إس
**Leading Software Development Solutions**

### 👨‍💻 **مهندس البرمجة: محمد حسين**
**Software Engineer: Mohamed Hussein**

*Specialized in Full-Stack Development & Modern Web Technologies*

</div>

---

## 📖 نبذة عن المشروع | About

منصة ويب متكاملة ومتطورة لعرض وإدارة السيارات الكلاسيكية الفاخرة وقطع الغيار الأصلية. تم تطويرها باستخدام أحدث التقنيات لتوفير تجربة مستخدم استثنائية وسرعة أداء عالية.

A comprehensive and advanced web platform for showcasing and managing luxury classic cars and genuine spare parts. Built with cutting-edge technologies to deliver exceptional user experience and high performance.

---

## ✨ المميزات الرئيسية | Key Features

### 🎯 للمستخدمين | User Features
- 🌍 **دعم متعدد اللغات** - عربي، إنجليزي، أوردو، هندي، روسي
- 🔍 **بحث وفلترة متقدمة** - البحث عن السيارات وقطع الغيار بسهولة
- 📱 **تصميم متجاوب بالكامل** - تجربة مثالية على جميع الأجهزة
- 🖼️ **معرض صور احترافي** - عرض تفصيلي للصور بجودة عالية
- 💬 **تواصل فوري عبر WhatsApp** - اتصال مباشر مع البائع
- ❤️ **قائمة الأمنيات** - حفظ المنتجات المفضلة
- 📊 **صفحات تعريفية شاملة** - دليل الشراء، من نحن، اتصل بنا

### 🛠️ لوحة التحكم | Admin Dashboard
- 🎨 **واجهة إدارة حديثة** - تصميم نظيف وسهل الاستخدام
- 🚗 **إدارة السيارات** - إضافة، تعديل، حذف، وتفعيل/تعطيل
- 🔧 **إدارة قطع الغيار** - نظام كامل لإدارة المخزون
- 📤 **رفع الصور بالسحب والإفلات** - نظام تحميل صور سهل
- 📊 **Analytics Dashboard** - تحليلات شاملة مع تحديث تلقائي كل 30 ثانية
  - عدد الزوار والمشاهدات اليومية
  - أكثر السيارات والقطع مشاهدة
  - إحصائيات الصفحات والأداء
- 📧 **إدارة الاستفسارات** - متابعة رسائل العملاء
- ⚙️ **إعدادات الموقع** - تخصيص الشعار والمعلومات

### 📈 تحليلات متقدمة | Advanced Analytics
- 📊 **تتبع الزوار** - نظام تحليلات شامل لتتبع زوار الموقع
- 📅 **إحصائيات يومية** - رسوم بيانية لآخر 7 أيام
- 🔝 **المحتوى الأكثر مشاهدة** - تحديد السيارات والقطع الأكثر شعبية
- 🔄 **تحديث تلقائي** - بيانات حية كل 30 ثانية
- 🌐 **تتبع IP والمتصفح** - معلومات تفصيلية عن الزوار

### 🎨 تجربة مستخدم محسّنة | Enhanced UX
- 🎭 **رأس ذكي** - اختفاء وظهور تلقائي عند التمرير
- ⚡ **أداء فائق السرعة** - تحسينات متقدمة للتحميل
- 🎯 **تصميم مدمج** - استغلال مثالي للمساحة
- 🖼️ **صور محسّنة** - عرض ثابت بدون نوافذ منبثقة
- 📱 **WhatsApp عائم** - زر تواصل سريع متاح دائماً

---

## 🛠️ التقنيات المستخدمة | Tech Stack

### Frontend
- **Next.js 16.1.4** - React Framework with App Router & Turbopack
- **React 19** - Latest React with Server Components
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first styling
- **Shadcn UI** - Beautiful component library
- **Framer Motion** - Smooth animations

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM 6.19.2** - Type-safe database access
- **SQLite** - Lightweight embedded database

### Features & Tools
- **Multi-language Support** - i18n internationalization
- **Image Optimization** - Next.js Image component
- **Analytics Tracking** - Custom analytics system
- **Authentication** - Secure admin authentication
- **WhatsApp Integration** - Direct customer communication

---

## 🚀 البدء السريع | Quick Start

### المتطلبات | Prerequisites
```bash
Node.js 18+ 
npm or yarn
```

### التثبيت | Installation
```bash
# Clone the repository
git clone https://github.com/your-username/classic-cars-platform.git

# Navigate to project directory
cd classic-cars-platform

# Install dependencies
npm install

# Setup database
npx prisma db push

# Create admin user
npx tsx prisma/scripts/create-admin.ts

# Start development server
npm run dev
```

### متغيرات البيئة | Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_WHATSAPP_NUMBER="971569141444"
```

---

## 📂 هيكل المشروع | Project Structure

```
📦 classic-cars-platform
├── 📁 prisma/              # Database schema & migrations
├── 📁 public/              # Static assets & uploads
├── 📁 src/
│   ├── 📁 app/             # Next.js App Router
│   │   ├── 📁 admin/       # Admin dashboard
│   │   │   ├── analytics/  # Analytics & tracking
│   │   │   ├── cars/       # Cars management
│   │   │   ├── parts/      # Parts management
│   │   │   └── inquiries/  # Customer inquiries
│   │   ├── 📁 api/         # API routes
│   │   ├── 📁 cars/        # Cars listing & details
│   │   └── 📁 parts/       # Parts listing & details
│   ├── 📁 components/      # React components
│   ├── 📁 contexts/        # React contexts
│   ├── 📁 lib/             # Utilities
│   └── 📁 locales/         # Translations (AR, EN, UR, HI, RU)
└── 📄 package.json
```

---

## 📊 قاعدة البيانات | Database Schema

```prisma
- Car (model, year, condition, price, images)
- SparePart (name, description, price, images)
- PageView (tracking & analytics)
- AnalyticsEvent (user events)
- Admin, Inquiry, Wishlist, SiteSettings
```

---

## 🔐 الأمان | Security

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation & sanitization
- ✅ XSS & CSRF protection

---

## 🌍 اللغات المدعومة | Supported Languages

- 🇸🇦 العربية (Arabic)
- 🇬🇧 English
- 🇵🇰 اردو (Urdu)
- 🇮🇳 हिंदी (Hindi)
- 🇷🇺 Русский (Russian)

---

## 📈 الأداء | Performance

- ⚡ **Lighthouse Score**: 95+
- 🚀 **First Contentful Paint**: < 1.5s
- 📊 **Time to Interactive**: < 2.5s
- ♿ **Accessibility**: 100

---

## 📞 التواصل | Contact

- **Company**: Vintage Point LLC / HS Company
- **Developer**: Mohamed Hussein
- **WhatsApp**: [+971 56 914 1444](https://wa.me/971569141444)
- **Email**: vintagepoint1444@gmail.com
- **Location**: [Google Maps](https://maps.app.goo.gl/ajpHTNU2GjwKdJHw7)

---

<div align="center">

### 🌟 إذا أعجبك المشروع، لا تنسَ وضع نجمة ⭐

**© 2026 HS Company - Developed by Mohamed Hussein**

**Made with ❤️ for Excellence in Software Development**

</div>
