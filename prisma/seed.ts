import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await db.adminUser.upsert({
    where: { email: 'admin@vintagepoint.com' },
    update: {},
    create: {
      email: 'admin@vintagepoint.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  })
  console.log('✓ Admin user created:', admin.email)

  // Create sample cars with high-quality realistic images
  const cars = [
    {
      id: 'car1',
      model: 'فورد موستنج 1965 | Ford Mustang 1965',
      year: 1965,
      condition: 'ممتازة | Excellent',
      price: 185000,
      description: 'سيارة فورد موستنج كلاسيكية بحالة ممتازة، تم ترميمها بالكامل مع الحفاظ على الأجزاء الأصلية. محرك V8 قوي، لون أحمر كلاسيكي، مقصورة داخلية جلدية فاخرة.\n\nClassic Ford Mustang in excellent condition, fully restored with original parts preserved. Powerful V8 engine, classic red color, luxurious leather interior.',
      images: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=95',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=95',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=95',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=95'
      ]
    },
    {
      id: 'car2',
      model: 'شيفروليه كامارو 1969 | Chevrolet Camaro 1969',
      year: 1969,
      condition: 'جيدة جداً | Very Good',
      price: 220000,
      description: 'شيفروليه كامارو بالمحرك الأصلي، أيقونة السباقات الأمريكية الكلاسيكية. تصميم عضلي قوي، أداء استثنائي، تاريخ موثق بالكامل.\n\nChevrolet Camaro with original engine, an icon of classic American racing. Powerful muscle design, exceptional performance, fully documented history.',
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=95',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=95',
        'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&q=95',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=95'
      ]
    },
    {
      id: 'car3',
      model: 'بورش 911 كلاسيك 1973 | Porsche 911 Classic 1973',
      year: 1973,
      condition: 'ممتازة | Excellent',
      price: 350000,
      description: 'بورش 911 الكلاسيكية بمحرك مبرد بالهواء، نادرة وثمينة. تصميم خالد، أداء رياضي متميز، استثمار مضمون للمستقبل.\n\nPorsche 911 classic air-cooled model, rare and precious. Timeless design, outstanding sports performance, guaranteed investment for the future.',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=95',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=95',
        'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=95',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=95'
      ]
    },
    {
      id: 'car4',
      model: 'مرسيدس بنز 280SL 1970 | Mercedes-Benz 280SL 1970',
      year: 1970,
      condition: 'ممتازة | Excellent',
      price: 295000,
      description: 'مرسيدس بنز 280SL الأسطورية، فخامة ألمانية أصيلة. سقف قابل للإزالة، تصميم أنيق خالد، صيانة كاملة ومنتظمة.\n\nLegendary Mercedes-Benz 280SL, authentic German luxury. Removable roof, timeless elegant design, complete and regular maintenance.',
      images: [
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=95',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=95',
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=95',
        'https://images.unsplash.com/photo-1606016159991-eff1bbc5ef08?w=1200&q=95'
      ]
    },
    {
      id: 'car5',
      model: 'جاكوار E-Type 1967 | Jaguar E-Type 1967',
      year: 1967,
      condition: 'ممتازة | Excellent',
      price: 425000,
      description: 'جاكوار E-Type، واحدة من أجمل السيارات في التاريخ. تصميم بريطاني أيقوني، محرك 6 سلندر قوي، لون أزرق معدني فاخر.\n\nJaguar E-Type, one of the most beautiful cars in history. Iconic British design, powerful 6-cylinder engine, luxurious metallic blue color.',
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=95',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=95',
        'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&q=95',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=95'
      ]
    },
    {
      id: 'car6',
      model: 'شيفروليه كورفيت C2 1965 | Chevrolet Corvette C2 1965',
      year: 1965,
      condition: 'جيدة جداً | Very Good',
      price: 315000,
      description: 'كورفيت C2 ستينغراي، أيقونة أمريكية خالدة. محرك V8 كبير، تصميم رياضي جريء، لون أبيض لؤلؤي مع مقصورة حمراء.\n\nCorvette C2 Stingray, timeless American icon. Big block V8 engine, bold sporty design, pearl white with red interior.',
      images: [
        'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=95',
        'https://images.unsplash.com/photo-1597404294360-ffc6d1b0087d?w=1200&q=95',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=95',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=95'
      ]
    },
    {
      id: 'car7',
      model: 'أستون مارتن DB5 1964 | Aston Martin DB5 1964',
      year: 1964,
      condition: 'ممتازة | Excellent',
      price: 895000,
      description: 'أستون مارتن DB5، سيارة جيمس بوند الشهيرة. فخامة بريطانية راقية، محرك 6 سلندر قوي، لون رمادي فضي كلاسيكي.\n\nAston Martin DB5, the famous James Bond car. High-class British luxury, powerful 6-cylinder engine, classic silver grey color.',
      images: [
        'https://images.unsplash.com/photo-1610880846497-7257b23f6138?w=1200&q=95',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=95',
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=95',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=95'
      ]
    },
    {
      id: 'car8',
      model: 'فيراري 250 GT 1962 | Ferrari 250 GT 1962',
      year: 1962,
      condition: 'ممتازة | Excellent',
      price: 1250000,
      description: 'فيراري 250 GT، تحفة فنية إيطالية نادرة. محرك V12 أسطوري، تصميم بينينفارينا الخالد، لون أحمر فيراري الأصلي.\n\nFerrari 250 GT, rare Italian masterpiece. Legendary V12 engine, timeless Pininfarina design, original Ferrari red color.',
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=95',
        'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&q=95',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=95',
        'https://images.unsplash.com/photo-1584345604476-8ec5f5e7d49d?w=1200&q=95'
      ]
    },
    {
      id: 'car9',
      model: 'رولز رويس سيلفر كلاود 1959 | Rolls-Royce Silver Cloud 1959',
      year: 1959,
      condition: 'ممتازة | Excellent',
      price: 385000,
      description: 'رولز رويس سيلفر كلاود، قمة الفخامة البريطانية. مقصورة خشبية فاخرة، محرك V8 هادئ، تاريخ موثق بالكامل.\n\nRolls-Royce Silver Cloud, pinnacle of British luxury. Luxurious wood interior, quiet V8 engine, fully documented history.',
      images: [
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=95',
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=95',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=95',
        'https://images.unsplash.com/photo-1606016159991-eff1bbc5ef08?w=1200&q=95'
      ]
    },
    {
      id: 'car10',
      model: 'دودج تشارجر 1970 | Dodge Charger 1970',
      year: 1970,
      condition: 'جيدة جداً | Very Good',
      price: 275000,
      description: 'دودج تشارجر، سيارة عضلية أسطورية. محرك HEMI 440، تصميم عدواني قوي، لون أسود لامع مع خطوط برتقالية.\n\nDodge Charger, legendary muscle car. HEMI 440 engine, aggressive powerful design, glossy black with orange stripes.',
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=95',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=95',
        'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&q=95',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=95'
      ]
    },
    {
      id: 'car11',
      model: 'بي إم دبليو 2002 Turbo 1974 | BMW 2002 Turbo 1974',
      year: 1974,
      condition: 'ممتازة | Excellent',
      price: 195000,
      description: 'بي إم دبليو 2002 توربو، أول سيارة إنتاج توربو من BMW. أداء رياضي ممتاز، تصميم ألماني كلاسيكي، لون أبيض نقي.\n\nBMW 2002 Turbo, first production turbo car from BMW. Excellent sports performance, classic German design, pure white color.',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=95',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=95',
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=95',
        'https://images.unsplash.com/photo-1606016159991-eff1bbc5ef08?w=1200&q=95'
      ]
    },
    {
      id: 'car12',
      model: 'ألفا روميو جوليا سوبر 1966 | Alfa Romeo Giulia Super 1966',
      year: 1966,
      condition: 'جيدة جداً | Very Good',
      price: 145000,
      description: 'ألفا روميو جوليا سوبر، سيارة سيدان رياضية إيطالية كلاسيكية. محرك Twin Cam، تصميم أنيق، لون أحمر ألفا التقليدي.\n\nAlfa Romeo Giulia Super, classic Italian sport sedan. Twin Cam engine, elegant design, traditional Alfa red color.',
      images: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=95',
        'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&q=95',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=95',
        'https://images.unsplash.com/photo-1597404294360-ffc6d1b0087d?w=1200&q=95'
      ]
    }
  ]

  for (const car of cars) {
    await db.car.upsert({
      where: { id: car.id },
      update: {},
      create: {
        ...car,
        images: JSON.stringify(car.images),
        isActive: true,
      },
    })
  }

  console.log(`✓ Created ${cars.length} sample cars`)

  // Create sample spare parts with realistic images
  const parts = [
    {
      id: 'part1',
      name: 'محرك V8 موستنج أصلي | Original Mustang V8 Engine',
      description: 'محرك V8 أصلي 289 بوصة مكعبة، حالة ممتازة، تم فحصه بالكامل. مناسب لموديلات 1964-1973.\n\nOriginal 289 cubic inch V8 engine block, excellent condition, fully inspected. Suitable for 1964-1973 models.',
      price: 15000,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&q=95',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1200&q=95',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&q=95',
        'https://images.unsplash.com/photo-1507328303669-e763425f6aad?w=1200&q=95'
      ]
    },
    {
      id: 'part2',
      name: 'لوحة عدادات كامارو RS | Camaro RS Dashboard',
      description: 'لوحة عدادات أصلية كاملة مع جميع المقاييس، حالة ممتازة، تعمل بشكل مثالي.\n\nOriginal complete dashboard with all gauges, excellent condition, works perfectly.',
      price: 8500,
      images: [
        'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=1200&q=95',
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=95',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=95',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=95'
      ]
    },
    {
      id: 'part3',
      name: 'ناقل حركة بورش 911 | Porsche 911 Transmission',
      description: 'ناقل حركة يدوي أصلي 5 سرعات، تم صيانته بالكامل، مثالي للاستخدام الفوري.\n\nOriginal 5-speed manual transmission, fully serviced, perfect for immediate use.',
      price: 25000,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&q=95',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1200&q=95',
        'https://images.unsplash.com/photo-1605238252241-3be0aa596b3e?w=1200&q=95',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&q=95'
      ]
    },
    {
      id: 'part4',
      name: 'مصابيح أمامية كلاسيكية | Classic Headlights Set',
      description: 'طقم مصابيح أمامية أصلية للسيارات الكلاسيكية، كروم لامع، زجاج عالي الجودة.\n\nOriginal classic car headlights set, shiny chrome, high-quality glass.',
      price: 3500,
      images: [
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=95',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=95',
        'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=95',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=95'
      ]
    },
    {
      id: 'part5',
      name: 'مقاعد جلد كلاسيكية | Classic Leather Seats',
      description: 'طقم مقاعد جلدية أصلية، تم تجديدها بالكامل، جلد طبيعي فاخر. مناسبة لمختلف الموديلات.\n\nOriginal leather seats set, fully restored, luxurious genuine leather. Suitable for various models.',
      price: 12500,
      images: [
        'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80',
        'https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=800&q=80'
      ]
    },
    {
      id: 'part6',
      name: 'عجلة قيادة خشبية أصلية | Original Wooden Steering Wheel',
      description: 'عجلة قيادة خشبية كلاسيكية بإطار كروم، حالة ممتازة، مناسبة للسيارات الفاخرة القديمة.\n\nClassic wooden steering wheel with chrome rim, excellent condition, suitable for vintage luxury cars.',
      price: 4200,
      images: [
        'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80',
        'https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=800&q=80'
      ]
    },
    {
      id: 'part7',
      name: 'مشعب عادم كامل | Complete Exhaust Manifold',
      description: 'مشعب عادم أصلي من الفولاذ المقاوم للصدأ، صوت عميق كلاسيكي، يزيد الأداء.\n\nOriginal stainless steel exhaust manifold, classic deep sound, increases performance.',
      price: 6800,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
        'https://images.unsplash.com/photo-1605238252241-3be0aa596b3e?w=800&q=80'
      ]
    },
    {
      id: 'part8',
      name: 'نظام تبريد كامل | Complete Cooling System',
      description: 'نظام تبريد كامل شامل الراديتر والمروحة والخراطيم، جديد بالكامل، ضمان سنة.\n\nComplete cooling system including radiator, fan and hoses, brand new, 1 year warranty.',
      price: 5500,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
        'https://images.unsplash.com/photo-1605238252241-3be0aa596b3e?w=800&q=80',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80'
      ]
    },
    {
      id: 'part9',
      name: 'فلاتر هواء أداء عالي | High Performance Air Filters',
      description: 'فلاتر هواء عالية الأداء، تزيد قوة المحرك وتحسن استهلاك الوقود، جودة ألمانية.\n\nHigh-performance air filters, increase engine power and improve fuel consumption, German quality.',
      price: 1800,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
        'https://images.unsplash.com/photo-1605238252241-3be0aa596b3e?w=800&q=80'
      ]
    },
    {
      id: 'part10',
      name: 'نظام فرامل محسّن | Upgraded Brake System',
      description: 'نظام فرامل قرصية محسّن، أقراص مثقبة ومشقوقة، توقف أسرع وأكثر أماناً.\n\nUpgraded disc brake system, drilled and slotted rotors, faster and safer stopping.',
      price: 9200,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
        'https://images.unsplash.com/photo-1605238252241-3be0aa596b3e?w=800&q=80',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80'
      ]
    },
    {
      id: 'part11',
      name: 'مصدات كروم أمامية وخلفية | Chrome Bumpers Front & Rear',
      description: 'طقم مصدات كروم كامل، لامع ومصقول، مقاوم للصدأ، يعيد المظهر الأصلي للسيارة.\n\nComplete chrome bumper set, shiny and polished, rust-resistant, restores original car appearance.',
      price: 7500,
      images: [
        'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80',
        'https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=800&q=80'
      ]
    },
    {
      id: 'part12',
      name: 'مرايا جانبية كلاسيكية | Classic Side Mirrors',
      description: 'طقم مرايا جانبية كروم، تصميم كلاسيكي أنيق، قابل للتعديل يدوياً، جودة عالية.\n\nChrome side mirrors set, elegant classic design, manually adjustable, high quality.',
      price: 2400,
      images: [
        'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80',
        'https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=800&q=80'
      ]
    },
    {
      id: 'part13',
      name: 'طقم سجاد أرضية فاخر | Luxury Floor Carpet Set',
      description: 'طقم سجاد أرضية مخملي فاخر، مطابق للمواصفات الأصلية، ألوان متعددة متوفرة.\n\nLuxury velvet floor carpet set, matching original specifications, multiple colors available.',
      price: 3200,
      images: [
        'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80',
        'https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=800&q=80'
      ]
    },
    {
      id: 'part14',
      name: 'إطارات وايت وول كلاسيكية | Classic White Wall Tires',
      description: 'طقم إطارات وايت وول الكلاسيكية، مقاس متعدد، مظهر أصيل للسيارات القديمة.\n\nClassic white wall tires set, multiple sizes, authentic look for vintage cars.',
      price: 5800,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
        'https://images.unsplash.com/photo-1605238252241-3be0aa596b3e?w=800&q=80'
      ]
    },
    {
      id: 'part15',
      name: 'نظام كهرباء متكامل | Complete Electrical System',
      description: 'نظام كهرباء كامل بأسلاك وموصلات جديدة، حماية من الحرارة، سهل التركيب.\n\nComplete electrical system with new wires and connectors, heat protection, easy installation.',
      price: 4500,
      images: [
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
        'https://images.unsplash.com/photo-1605238252241-3be0aa596b3e?w=800&q=80',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80'
      ]
    }
  ]

  for (const part of parts) {
    await db.sparePart.upsert({
      where: { id: part.id },
      update: {},
      create: {
        ...part,
        images: JSON.stringify(part.images),
        isActive: true,
      },
    })
  }

  console.log(`✓ Created ${parts.length} sample spare parts`)

  // Create site settings
  const settings = await db.siteSettings.upsert({
    where: { id: 'settings1' },
    update: {},
    create: {
      id: 'settings1',
      logoUrl: '',
    },
  })

  console.log('✓ Site settings created')

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📝 Login credentials:')
  console.log('   Email: admin@vintagepoint.com')
  console.log('   Password: admin123')
  console.log('\n🔗 Admin URL: http://localhost:3000/admin/login')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
