# Vintage Point - Comprehensive Maintenance Script
# سكريبت الصيانة الشاملة

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  بدء الصيانة الشاملة للمشروع" -ForegroundColor Cyan
Write-Host "  Comprehensive Maintenance Started" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean Project
Write-Host ">> الخطوة 1: تنظيف المشروع | Step 1: Cleaning" -ForegroundColor Yellow

if (Test-Path ".next") {
    Write-Host "   حذف .next | Removing .next..." -ForegroundColor Magenta
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   تم بنجاح | Done!" -ForegroundColor Green
}

if (Test-Path "node_modules") {
    Write-Host "   حذف node_modules | Removing node_modules..." -ForegroundColor Magenta
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   تم بنجاح | Done!" -ForegroundColor Green
}

Write-Host ""

# Step 2: Install Dependencies
Write-Host ">> الخطوة 2: تثبيت المكتبات | Step 2: Installing" -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "   تم التثبيت بنجاح | Installed successfully!" -ForegroundColor Green
}
else {
    Write-Host "   خطأ في التثبيت | Installation error!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Fix ESLint
Write-Host ">> الخطوة 3: تصليح ESLint | Step 3: Fixing ESLint" -ForegroundColor Yellow
npx eslint . --ext .js,.jsx,.ts,.tsx --fix --max-warnings=0 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   تم التصليح | Fixed!" -ForegroundColor Green
}
else {
    Write-Host "   بعض المشاكل تحتاج تصليح يدوي | Some issues need manual fix" -ForegroundColor DarkYellow
}

Write-Host ""

# Step 4: TypeScript Check
Write-Host ">> الخطوة 4: فحص TypeScript | Step 4: TS Check" -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "   لا توجد أخطاء | No errors!" -ForegroundColor Green
}
else {
    Write-Host "   يوجد بعض الأخطاء | Some errors found" -ForegroundColor DarkYellow
}

Write-Host ""

# Step 5: Build Project
Write-Host ">> الخطوة 5: بناء المشروع | Step 5: Building" -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   تم البناء بنجاح | Built successfully!" -ForegroundColor Green
}
else {
    Write-Host "   فشل البناء | Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  انتهت الصيانة بنجاح!" -ForegroundColor Green
Write-Host "  Maintenance Completed Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "لتشغيل السيرفر: npm run dev" -ForegroundColor Cyan
Write-Host "To start server: npm run dev" -ForegroundColor Cyan
Write-Host ""
