import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const classicCars = [
  {
    model: 'Cadillac DeVille 1970',
    year: 1970,
    condition: 'ممتازة | Excellent',
    price: 185000,
    description: 'كاديلاك ديفيل 1970 كلاسيكية بحالة ممتازة، لون أخضر نعناعي أصلي، محرك V8، تكييف، داخلية جلد فاخرة، مرايا كروم لامعة. سيارة نادرة وأيقونية من العصر الذهبي للسيارات الأمريكية.\n\n1970 Cadillac DeVille in excellent condition, original mint green color, V8 engine, A/C, luxurious leather interior, chrome mirrors. A rare and iconic car from the golden era of American automobiles.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ])
  },
  {
    model: 'Chevrolet Bel Air 1957',
    year: 1957,
    condition: 'ممتازة | Excellent',
    price: 295000,
    description: 'شيفروليه بيل اير 1957 الأيقونية، لون تركواز وأبيض كلاسيكي، محرك V8 قوي، كروم لامع، جنوط أصلية، داخلية بحالة المصنع. واحدة من أشهر السيارات الكلاسيكية في التاريخ.\n\nIconic 1957 Chevrolet Bel Air, classic turquoise and white color, powerful V8 engine, shiny chrome, original wheels, factory interior. One of the most famous classic cars in history.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800',
      'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800'
    ])
  },
  {
    model: 'Ford Mustang 1967',
    year: 1967,
    condition: 'جيدة جداً | Very Good',
    price: 220000,
    description: 'فورد موستنج 1967 الأسطورية، محرك V8 فاستباك، لون أحمر كلاسيكي، جنوط رياضية، داخلية سوداء، نظام عادم رياضي. سيارة رياضية أمريكية أيقونية بقوة وأداء مذهل.\n\nLegendary 1967 Ford Mustang, V8 Fastback engine, classic red color, sport wheels, black interior, sport exhaust system. An iconic American sports car with amazing power and performance.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1584345604476-8ec5f82c3c7e?w=800',
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ])
  },
  {
    model: 'Mercedes-Benz 280SE 1971',
    year: 1971,
    condition: 'ممتازة | Excellent',
    price: 165000,
    description: 'مرسيدس بنز 280SE 1971 الفاخرة، لون بني ذهبي معدني، محرك 6 سلندر، داخلية جلد بيج، فتحة سقف، كروم أصلي، حالة استثنائية. تمثل الفخامة والأناقة الألمانية الكلاسيكية.\n\nLuxurious 1971 Mercedes-Benz 280SE, metallic bronze color, 6-cylinder engine, beige leather interior, sunroof, original chrome, exceptional condition. Represents classic German luxury and elegance.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
    ])
  },
  {
    model: 'Porsche 911 Carrera 1973',
    year: 1973,
    condition: 'جيدة جداً | Very Good',
    price: 385000,
    description: 'بورش 911 كاريرا 1973، لون أزرق ميتاليك، محرك 6 سلندر بوكسر، جنوط فوش الأصلية، داخلية سوداء بحالة ممتازة، نظام تعليق رياضي. أيقونة السيارات الرياضية الألمانية.\n\n1973 Porsche 911 Carrera, metallic blue color, 6-cylinder Boxer engine, original Fuchs wheels, black interior in excellent condition, sport suspension. German sports car icon.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800',
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ])
  },
  {
    model: 'Jaguar E-Type 1968',
    year: 1968,
    condition: 'جيدة | Good',
    price: 275000,
    description: 'جاكوار إي-تايب 1968، واحدة من أجمل السيارات على الإطلاق، لون أخضر بريطاني، محرك 6 سلندر، داخلية جلد بني، كروم لامع، تصميم انسيابي خالد. تحفة فنية بريطانية.\n\n1968 Jaguar E-Type, one of the most beautiful cars ever made, British racing green, 6-cylinder engine, tan leather interior, shiny chrome, timeless streamlined design. British automotive masterpiece.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800'
    ])
  },
  {
    model: 'Volkswagen Beetle 1965',
    year: 1965,
    condition: 'جيدة جداً | Very Good',
    price: 85000,
    description: 'فولكس واجن بيتل 1965 الشهيرة، لون أزرق فاتح، محرك خلفي، فتحة سقف، داخلية أصلية، حالة ممتازة. سيارة أيقونية وموثوقة، رمز من رموز الستينات.\n\nFamous 1965 Volkswagen Beetle, light blue color, rear engine, sunroof, original interior, excellent condition. An iconic and reliable car, a symbol of the sixties.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ])
  },
  {
    model: 'Chevrolet Corvette Stingray 1969',
    year: 1969,
    condition: 'ممتازة | Excellent',
    price: 325000,
    description: 'شيفروليه كورفيت ستينجراي 1969، لون برتقالي ناري، محرك V8 كبير، جنوط رياضية، سقف T-top، داخلية سوداء، أداء رهيب. السيارة الرياضية الأمريكية الأسطورية.\n\n1969 Chevrolet Corvette Stingray, hugger orange color, big block V8 engine, sport wheels, T-top roof, black interior, amazing performance. The legendary American sports car.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1552519507-cf0d4c49d3e9?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ])
  }
]

async function main() {
  console.log('🚗 بدء إضافة السيارات الكلاسيكية...')
  console.log('🚗 Starting to add classic cars...\n')

  for (const car of classicCars) {
    try {
      const created = await prisma.car.create({
        data: {
          ...car,
          isActive: true,
          isFeatured: Math.random() > 0.5 // 50% chance to be featured
        }
      })
      console.log(`✅ تم إضافة: ${car.model} (${car.year}) - ${car.price} AED`)
    } catch (error) {
      console.error(`❌ خطأ في إضافة ${car.model}:`, error)
    }
  }

  console.log('\n✨ تم الانتهاء من إضافة السيارات!')
  console.log('✨ Finished adding cars!')
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
