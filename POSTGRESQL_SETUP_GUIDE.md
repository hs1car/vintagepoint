# دليل إعداد PostgreSQL - Kali Linux على Windows 11

## 🎯 أنت الآن هنا
```bash
postgres@hs:~$
```

## خطوات الإعداد الكاملة

### 1️⃣ التحقق من PostgreSQL
```bash
# تحقق من الإصدار
psql --version

# إذا لم يكن مثبتًا، ثبته:
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

### 2️⃣ بدء خدمة PostgreSQL
```bash
# ابدأ الخدمة
sudo service postgresql start

# تحقق من حالة الخدمة
sudo service postgresql status
```

### 3️⃣ إنشاء قاعدة البيانات
```bash
# أنت الآن في حساب postgres، لذا:

# ادخل إلى PostgreSQL shell
psql

# ستظهر لك:
# postgres=#

# الآن أنشئ قاعدة البيانات:
CREATE DATABASE vintage_cars;

# أنشئ مستخدم جديد (اختياري - أو استخدم postgres):
CREATE USER vintage_admin WITH PASSWORD 'your_strong_password_here';

# امنح الصلاحيات:
GRANT ALL PRIVILEGES ON DATABASE vintage_cars TO vintage_admin;

# في PostgreSQL 15+, امنح صلاحيات إضافية:
\c vintage_cars
GRANT ALL ON SCHEMA public TO vintage_admin;

# اخرج من psql:
\q
```

### 4️⃣ التحقق من قاعدة البيانات
```bash
# سجل دخول إلى قاعدة البيانات الجديدة:
psql -d vintage_cars

# تحقق من الاتصال:
\conninfo

# اخرج:
\q
```

### 5️⃣ السماح بالاتصال من Windows
```bash
# افتح ملف pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# أضف هذا السطر (للسماح بالاتصال من localhost):
# host    all             all             0.0.0.0/0               md5

# احفظ واخرج (Ctrl+O, Enter, Ctrl+X)

# افتح ملف postgresql.conf
sudo nano /etc/postgresql/*/main/postgresql.conf

# ابحث عن السطر:
# listen_addresses = 'localhost'

# غيره إلى:
# listen_addresses = '*'

# احفظ واخرج

# أعد تشغيل PostgreSQL:
sudo service postgresql restart
```

### 6️⃣ احصل على معلومات الاتصال
```bash
# احصل على عنوان IP الخاص بـ Kali:
hostname -I

# أو:
ip addr show eth0 | grep "inet "

# سيظهر شيء مثل: 172.x.x.x أو 192.168.x.x
```

## 🔗 الاتصال من مشروع Next.js

### في Windows (مشروع Next.js)

#### خطوة 1: أنشئ ملف `.env.production`
```bash
# في مجلد المشروع (Windows Terminal):
cd c:\Users\1medo\Desktop\v
```

أنشئ ملف `.env.production`:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://vintage_admin:your_strong_password_here@KALI_IP_ADDRESS:5432/vintage_cars"

# أو إذا استخدمت مستخدم postgres الافتراضي:
# DATABASE_URL="postgresql://postgres:postgres@KALI_IP_ADDRESS:5432/vintage_cars"

# Security
SESSION_SECRET="استبدل_بسلسلة_عشوائية_32_حرف_على_الأقل"
CSRF_SECRET="استبدل_بسلسلة_عشوائية_32_حرف_على_الأقل"

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="production"
```

**⚠️ استبدل**:
- `KALI_IP_ADDRESS`: بعنوان IP من الخطوة 6
- `your_strong_password_here`: بكلمة المرور التي أنشأتها
- `SESSION_SECRET`: بسلسلة عشوائية قوية
- `CSRF_SECRET`: بسلسلة عشوائية قوية

#### خطوة 2: تحديث Prisma Schema
```bash
# الملف موجود بالفعل - فقط تحقق منه:
notepad prisma\schema.prisma
```

تأكد من أن السطر هكذا:
```prisma
datasource db {
  provider = "postgresql"  // ✅ يجب أن يكون postgresql
  url      = env("DATABASE_URL")
}
```

#### خطوة 3: إنشاء Secrets عشوائية
```powershell
# في PowerShell:
# توليد SESSION_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# توليد CSRF_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# انسخ النتائج وضعها في .env.production
```

#### خطوة 4: اختبار الاتصال
```powershell
# في Windows PowerShell:
cd c:\Users\1medo\Desktop\v

# اختبر الاتصال:
npx prisma db pull

# يجب أن تظهر:
# ✔ Introspected 9 models and wrote them into...
```

#### خطوة 5: تطبيق المايجريشن
```powershell
# احذف المايجريشن القديمة (SQLite):
Remove-Item -Recurse -Force prisma\migrations

# أنشئ مايجريشن جديدة:
npx prisma migrate dev --name init_postgresql

# أو إذا كنت في production:
npx prisma migrate deploy
```

#### خطوة 6: Generate Prisma Client
```powershell
npx prisma generate
```

#### خطوة 7: تطبيق البيانات الأولية
```powershell
# أنشئ admin:
npx tsx prisma/scripts/create-admin.ts

# أنشئ بيانات تجريبية (اختياري):
npx tsx prisma/seed.ts
```

#### خطوة 8: بناء وتشغيل
```powershell
# بناء المشروع:
npm run build

# تشغيل production:
npm start

# سيعمل على: http://localhost:3000
```

## 🔧 استكشاف الأخطاء

### خطأ: "Connection refused"
```bash
# في Kali Linux:
# تحقق من أن PostgreSQL يعمل:
sudo service postgresql status

# تحقق من المنفذ:
sudo netstat -tulpn | grep 5432

# أعد تشغيل:
sudo service postgresql restart
```

### خطأ: "Authentication failed"
```bash
# في Kali Linux:
# سجل دخول كـ postgres:
sudo -u postgres psql

# غير كلمة المرور:
ALTER USER postgres PASSWORD 'new_password';

# أو:
ALTER USER vintage_admin PASSWORD 'new_password';

# اخرج:
\q
```

### خطأ: "Database does not exist"
```bash
# تحقق من القواعد الموجودة:
sudo -u postgres psql -l

# إذا لم تكن موجودة، أنشئها:
sudo -u postgres createdb vintage_cars
```

### خطأ: "Could not connect to server"
```bash
# تحقق من الجدار الناري:
sudo ufw allow 5432/tcp

# أعد تشغيل PostgreSQL:
sudo service postgresql restart
```

## 📊 أوامر مفيدة

### في Kali Linux (PostgreSQL):
```bash
# سجل دخول إلى PostgreSQL:
sudo -u postgres psql

# الاتصال بقاعدة بيانات:
\c vintage_cars

# عرض الجداول:
\dt

# عرض البيانات:
SELECT * FROM "User";
SELECT * FROM "Car" LIMIT 5;

# عرض معلومات جدول:
\d "Car"

# حذف جميع البيانات (كن حذرًا):
TRUNCATE TABLE "Car" CASCADE;

# عمل نسخة احتياطية:
pg_dump vintage_cars > backup.sql

# استعادة من نسخة احتياطية:
psql vintage_cars < backup.sql

# الخروج:
\q
```

### في Windows (Prisma):
```powershell
# عرض البيانات:
npx prisma studio

# تحديث Schema من DB:
npx prisma db pull

# تطبيق التغييرات على DB:
npx prisma db push

# إنشاء migration:
npx prisma migrate dev --name migration_name

# تطبيق migrations في production:
npx prisma migrate deploy
```

## ✅ التحقق النهائي

### في Kali Linux:
```bash
# تحقق من الاتصال:
sudo -u postgres psql -d vintage_cars -c "SELECT version();"

# تحقق من الجداول:
sudo -u postgres psql -d vintage_cars -c "\dt"
```

### في Windows:
```powershell
# تحقق من الاتصال:
npx prisma db pull

# افتح Prisma Studio:
npx prisma studio
# ثم افتح: http://localhost:5555
```

## 🎉 الآن أنت جاهز!

إذا نجحت جميع الخطوات، سيكون لديك:
- ✅ PostgreSQL يعمل على Kali Linux
- ✅ قاعدة بيانات vintage_cars
- ✅ Next.js متصل بـ PostgreSQL
- ✅ Prisma يعمل بشكل صحيح

---

**ملاحظات مهمة**:
1. **كلمات المرور**: احفظها في مكان آمن
2. **IP Address**: قد يتغير عند إعادة تشغيل Kali
3. **Security**: لا تعرض المنفذ 5432 للإنترنت مباشرة
4. **Backup**: اعمل نسخ احتياطية منتظمة

**الخطوة التالية**: أخبرني بأي خطأ تواجهه أو إذا نجحت جميع الخطوات!
