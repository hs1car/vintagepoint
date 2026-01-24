'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  ClipboardCheck, 
  FileText, 
  Wrench, 
  Car, 
  ShieldCheck, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Gauge,
  MapPin,
  Phone
} from 'lucide-react'

export default function BuyingGuidePage() {
  const { t, isRTL } = useLanguage()

  const sections = [
    {
      id: 'introduction',
      icon: BookOpen,
      titleEn: 'Introduction to Classic Cars',
      titleAr: 'مقدمة عن السيارات الكلاسيكية',
      contentEn: [
        'Classic cars represent a unique intersection of automotive history, craftsmanship, and investment potential. Unlike modern vehicles, classic cars tell stories of bygone eras and automotive innovation.',
        'Before purchasing a classic car, it\'s essential to understand what defines a "classic" vehicle. Generally, cars are considered classic if they are 20-40 years old and have historical significance, unique design, or limited production numbers.',
        'The classic car market has shown consistent growth over the past decades, with certain models appreciating significantly in value. However, buying a classic car requires careful consideration of maintenance costs, availability of parts, and restoration needs.'
      ],
      contentAr: [
        'تمثل السيارات الكلاسيكية تقاطعًا فريدًا بين تاريخ السيارات والحرفية وإمكانات الاستثمار. على عكس السيارات الحديثة، تحكي السيارات الكلاسيكية قصص عصور ماضية وابتكارات في صناعة السيارات.',
        'قبل شراء سيارة كلاسيكية، من الضروري فهم ما يحدد المركبة "الكلاسيكية". بشكل عام، تعتبر السيارات كلاسيكية إذا كان عمرها 20-40 عامًا ولها أهمية تاريخية أو تصميم فريد أو أرقام إنتاج محدودة.',
        'أظهر سوق السيارات الكلاسيكية نموًا ثابتًا خلال العقود الماضية، حيث ارتفعت قيمة بعض الطرازات بشكل كبير. ومع ذلك، يتطلب شراء سيارة كلاسيكية دراسة متأنية لتكاليف الصيانة وتوافر قطع الغيار واحتياجات الترميم.'
      ]
    },
    {
      id: 'finding',
      icon: Search,
      titleEn: 'Finding the Right Classic Car',
      titleAr: 'العثور على السيارة الكلاسيكية المناسبة',
      contentEn: [
        'Start by defining your budget, including not just the purchase price but also restoration, maintenance, and insurance costs. Research which models fit your budget and interest.',
        'Consider the purpose of your purchase: Are you buying for investment, personal enjoyment, or restoration projects? This will guide your selection criteria.',
        'Look for reputable dealers, auctions, and private sellers. In Dubai and the UAE, specialized classic car dealerships like Vintage Point offer curated selections with verified histories.',
        'Join classic car clubs and online communities to gain insights from experienced collectors and enthusiasts.'
      ],
      contentAr: [
        'ابدأ بتحديد ميزانيتك، بما في ذلك ليس فقط سعر الشراء ولكن أيضًا تكاليف الترميم والصيانة والتأمين. ابحث عن الطرازات التي تناسب ميزانيتك واهتمامك.',
        'ضع في اعتبارك الغرض من الشراء: هل تشتري للاستثمار أو للمتعة الشخصية أو لمشاريع الترميم؟ سيساعدك ذلك في تحديد معايير الاختيار.',
        'ابحث عن التجار والمزادات والبائعين الخاصين ذوي السمعة الطيبة. في دبي والإمارات، تقدم وكالات السيارات الكلاسيكية المتخصصة مثل Vintage Point مجموعة مختارة مع تواريخ موثقة.',
        'انضم إلى نوادي السيارات الكلاسيكية والمجتمعات عبر الإنترنت للحصول على رؤى من الجامعين والمتحمسين ذوي الخبرة.'
      ]
    },
    {
      id: 'evaluation',
      icon: ClipboardCheck,
      titleEn: 'Evaluating Condition and Authenticity',
      titleAr: 'تقييم الحالة والأصالة',
      contentEn: [
        'Check for matching numbers: The engine, transmission, and chassis numbers should match the factory records. Matching numbers significantly increase a classic car\'s value.',
        'Inspect the body for rust, especially in structural areas like floor panels, trunk, and door sills. Surface rust can be fixed, but structural rust is expensive to repair.',
        'Examine the paint: Original paint (if in good condition) is more valuable than a repaint. However, professional restorations can also add value.',
        'Verify authenticity: Check that the car has original parts or period-correct replacements. Non-original modifications can decrease value unless they enhance performance while maintaining character.',
        'Look for documentation: Service records, original manuals, and historical documentation increase value and authenticity.'
      ],
      contentAr: [
        'تحقق من تطابق الأرقام: يجب أن تتطابق أرقام المحرك وناقل الحركة والهيكل مع سجلات المصنع. الأرقام المتطابقة تزيد بشكل كبير من قيمة السيارة الكلاسيكية.',
        'فحص الهيكل بحثًا عن الصدأ، خاصة في المناطق الهيكلية مثل ألواح الأرضية وصندوق السيارة وعتبات الأبواب. يمكن إصلاح الصدأ السطحي، لكن الصدأ الهيكلي مكلف للإصلاح.',
        'فحص الطلاء: الطلاء الأصلي (إذا كان في حالة جيدة) أكثر قيمة من إعادة الطلاء. ومع ذلك، يمكن للترميمات الاحترافية أن تضيف قيمة أيضًا.',
        'التحقق من الأصالة: تحقق من أن السيارة تحتوي على أجزاء أصلية أو بدائل صحيحة للفترة. التعديلات غير الأصلية يمكن أن تقلل القيمة ما لم تعزز الأداء مع الحفاظ على الطابع.',
        'ابحث عن الوثائق: سجلات الخدمة والأدلة الأصلية والوثائق التاريخية تزيد من القيمة والأصالة.'
      ]
    },
    {
      id: 'documentation',
      icon: FileText,
      titleEn: 'Essential Documentation',
      titleAr: 'الوثائق الأساسية',
      contentEn: [
        'Title and Registration: Ensure the seller has a clear title with no liens. In the UAE, verify the registration documents and ownership transfer requirements.',
        'Service History: Complete service records demonstrate proper maintenance and can reveal potential issues.',
        'Build Sheet or Window Sticker: Original factory documentation showing the car\'s specifications and options.',
        'Previous Ownership Records: Understanding the car\'s ownership history helps verify authenticity and proper care.',
        'Restoration Documentation: If the car has been restored, receipts and photos of the restoration process add value and transparency.',
        'Import Documentation: For imported classic cars, ensure all customs and import paperwork is complete and legal.'
      ],
      contentAr: [
        'سند الملكية والتسجيل: تأكد من أن البائع لديه سند ملكية واضح بدون رهون. في الإمارات، تحقق من وثائق التسجيل ومتطلبات نقل الملكية.',
        'تاريخ الخدمة: سجلات الخدمة الكاملة تثبت الصيانة الصحيحة ويمكن أن تكشف عن مشاكل محتملة.',
        'ورقة البناء أو ملصق النافذة: الوثائق الأصلية من المصنع التي توضح مواصفات السيارة والخيارات.',
        'سجلات الملكية السابقة: فهم تاريخ ملكية السيارة يساعد على التحقق من الأصالة والعناية الصحيحة.',
        'وثائق الترميم: إذا تم ترميم السيارة، فإن الإيصالات والصور لعملية الترميم تضيف قيمة وشفافية.',
        'وثائق الاستيراد: للسيارات الكلاسيكية المستوردة، تأكد من اكتمال جميع أوراق الجمارك والاستيراد وقانونيتها.'
      ]
    },
    {
      id: 'inspection',
      icon: Wrench,
      titleEn: 'Professional Inspection',
      titleAr: 'الفحص الاحترافي',
      contentEn: [
        'Always hire a qualified classic car mechanic for a pre-purchase inspection. The cost (typically $200-500) is minimal compared to potential repair expenses.',
        'Mechanical Systems: Check the engine, transmission, brakes, suspension, and electrical systems. Test drive the car to identify any performance issues.',
        'Structural Integrity: Professional inspectors can identify hidden rust, accident damage, or structural repairs that may not be visible.',
        'Authenticity Verification: Experts can confirm matching numbers and identify non-original parts or modifications.',
        'Estimated Repair Costs: A good inspector will provide a detailed report of needed repairs and estimated costs, helping you negotiate the purchase price.',
        'In Dubai, specialized classic car inspection services are available that understand the unique challenges of maintaining classic cars in desert climates.'
      ],
      contentAr: [
        'قم دائمًا بتوظيف ميكانيكي سيارات كلاسيكية مؤهل لفحص ما قبل الشراء. التكلفة (عادة 200-500 دولار) ضئيلة مقارنة بتكاليف الإصلاح المحتملة.',
        'الأنظمة الميكانيكية: فحص المحرك وناقل الحركة والفرامل والتعليق والأنظمة الكهربائية. اختبر قيادة السيارة لتحديد أي مشاكل في الأداء.',
        'السلامة الهيكلية: يمكن للمفتشين المحترفين تحديد الصدأ الخفي أو أضرار الحوادث أو الإصلاحات الهيكلية التي قد لا تكون مرئية.',
        'التحقق من الأصالة: يمكن للخبراء تأكيد تطابق الأرقام وتحديد الأجزاء أو التعديلات غير الأصلية.',
        'تكاليف الإصلاح المقدرة: سيقدم المفتش الجيد تقريرًا مفصلاً بالإصلاحات المطلوبة والتكاليف المقدرة، مما يساعدك على التفاوض على سعر الشراء.',
        'في دبي، تتوفر خدمات فحص السيارات الكلاسيكية المتخصصة التي تفهم التحديات الفريدة للحفاظ على السيارات الكلاسيكية في المناخ الصحراوي.'
      ]
    },
    {
      id: 'test-drive',
      icon: Car,
      titleEn: 'The Test Drive',
      titleAr: 'اختبار القيادة',
      contentEn: [
        'Before driving, walk around the car and look for any fluid leaks, tire condition, and body alignment issues.',
        'Start the engine when cold if possible. Listen for unusual noises, check for excessive smoke, and observe the idle quality.',
        'During the drive, test all functions: brakes, steering, transmission shifting, clutch (if manual), and electrical systems.',
        'Pay attention to how the car tracks on the road. Pulling to one side may indicate alignment issues or suspension problems.',
        'Test at various speeds and road conditions. Highway driving reveals different issues than city driving.',
        'Note: Classic cars drive differently than modern vehicles. They may have heavier steering, longer brake distances, and different handling characteristics. This is normal and part of the vintage driving experience.'
      ],
      contentAr: [
        'قبل القيادة، تجول حول السيارة وابحث عن أي تسرب سوائل أو حالة الإطارات أو مشاكل محاذاة الهيكل.',
        'ابدأ تشغيل المحرك عندما يكون باردًا إن أمكن. استمع إلى أي أصوات غير عادية، تحقق من الدخان الزائد، ولاحظ جودة الخمول.',
        'أثناء القيادة، اختبر جميع الوظائف: الفرامل والتوجيه وتبديل ناقل الحركة والقابض (إذا كان يدويًا) والأنظمة الكهربائية.',
        'انتبه إلى كيفية تتبع السيارة على الطريق. الانجرار إلى جانب واحد قد يشير إلى مشاكل في المحاذاة أو التعليق.',
        'اختبر بسرعات مختلفة وظروف طريق. القيادة على الطرق السريعة تكشف عن مشاكل مختلفة عن القيادة في المدينة.',
        'ملاحظة: السيارات الكلاسيكية تقود بشكل مختلف عن السيارات الحديثة. قد يكون لديها توجيه أثقل ومسافات فرملة أطول وخصائص مناولة مختلفة. هذا طبيعي وجزء من تجربة القيادة القديمة.'
      ]
    },
    {
      id: 'purchase',
      icon: ShieldCheck,
      titleEn: 'Making the Purchase',
      titleAr: 'إتمام الشراء',
      contentEn: [
        'Negotiate based on inspection findings and market research. Use price guides like Hagerty, Classic.com, or bring a local classic car expert.',
        'Consider the total cost of ownership: insurance (classic car insurance is usually affordable), storage, maintenance, and potential repairs.',
        'Payment methods: For high-value classics, consider escrow services to protect both buyer and seller.',
        'Insurance: Arrange classic car insurance before taking delivery. Many insurers offer agreed-value policies that protect your investment.',
        'Registration and Legal: Complete all registration transfers and legal requirements. In the UAE, classic cars may qualify for special registration categories.',
        'Transportation: If the car needs to be transported, use specialized classic car transport services to prevent damage.',
        'Get everything in writing: Bill of sale should detail the car, price, condition, and any warranties or guarantees.'
      ],
      contentAr: [
        'تفاوض بناءً على نتائج الفحص وأبحاث السوق. استخدم أدلة الأسعار مثل Hagerty أو Classic.com أو أحضر خبيرًا محليًا في السيارات الكلاسيكية.',
        'ضع في اعتبارك التكلفة الإجمالية للملكية: التأمين (تأمين السيارات الكلاسيكية عادة ما يكون ميسور التكلفة) والتخزين والصيانة والإصلاحات المحتملة.',
        'طرق الدفع: للسيارات الكلاسيكية عالية القيمة، فكر في خدمات الضمان لحماية كل من المشتري والبائع.',
        'التأمين: رتب تأمين السيارات الكلاسيكية قبل استلام السيارة. يقدم العديد من شركات التأمين بوليصات بقيمة متفق عليها تحمي استثمارك.',
        'التسجيل والقانونية: أكمل جميع نقل التسجيل والمتطلبات القانونية. في الإمارات، قد تكون السيارات الكلاسيكية مؤهلة لفئات تسجيل خاصة.',
        'النقل: إذا كانت السيارة بحاجة إلى نقل، استخدم خدمات نقل السيارات الكلاسيكية المتخصصة لمنع الضرر.',
        'احصل على كل شيء كتابيًا: يجب أن توضح فاتورة البيع السيارة والسعر والحالة وأي ضمانات أو كفالات.'
      ]
    },
    {
      id: 'maintenance',
      icon: TrendingUp,
      titleEn: 'Maintenance and Preservation',
      titleAr: 'الصيانة والحفظ',
      contentEn: [
        'Regular maintenance is crucial for classic cars. Establish a relationship with a trusted classic car mechanic or specialized shop.',
        'Storage: Classic cars need proper storage. Climate-controlled garages protect against extreme temperatures and humidity. In Dubai\'s climate, air conditioning and dehumidification are essential.',
        'Driving: Regular use (at least monthly) keeps mechanical systems lubricated and prevents deterioration. However, avoid daily driving which accelerates wear.',
        'Fluid changes: Change oil, coolant, brake fluid, and other fluids more frequently than modern cars, especially if the car sits for periods.',
        'Documentation: Keep detailed records of all maintenance, repairs, and upgrades. This documentation adds value when you eventually sell.',
        'Parts sourcing: Build relationships with parts suppliers and join model-specific clubs where members share resources and knowledge.',
        'Protective measures: Use car covers, fuel stabilizers, battery tenders, and jack stands for long-term storage.'
      ],
      contentAr: [
        'الصيانة المنتظمة أمر بالغ الأهمية للسيارات الكلاسيكية. أنشئ علاقة مع ميكانيكي سيارات كلاسيكية موثوق أو ورشة متخصصة.',
        'التخزين: تحتاج السيارات الكلاسيكية إلى تخزين مناسب. المرائب ذات التحكم في المناخ تحمي من درجات الحرارة والرطوبة الشديدة. في مناخ دبي، تكييف الهواء وإزالة الرطوبة ضروريان.',
        'القيادة: الاستخدام المنتظم (شهريًا على الأقل) يحافظ على تشحيم الأنظمة الميكانيكية ويمنع التدهور. ومع ذلك، تجنب القيادة اليومية التي تسرع التآكل.',
        'تغيير السوائل: غير الزيت والمبرد وسائل الفرامل والسوائل الأخرى بشكل أكثر تكرارًا من السيارات الحديثة، خاصة إذا كانت السيارة تجلس لفترات.',
        'التوثيق: احتفظ بسجلات مفصلة لجميع الصيانة والإصلاحات والترقيات. هذا التوثيق يضيف قيمة عندما تبيع في النهاية.',
        'الحصول على القطع: بناء علاقات مع موردي القطع والانضمام إلى نوادي خاصة بالطراز حيث يشارك الأعضاء الموارد والمعرفة.',
        'تدابير الحماية: استخدم أغطية السيارات ومثبتات الوقود وشواحن البطاريات وحوامل الرافعة للتخزين طويل الأمد.'
      ]
    },
    {
      id: 'conclusion',
      icon: CheckCircle,
      titleEn: 'Conclusion',
      titleAr: 'الخلاصة',
      contentEn: [
        'Buying a classic car is a rewarding experience that combines passion, investment, and automotive heritage. With proper research, inspection, and maintenance, your classic car can provide years of enjoyment and potentially appreciate in value.',
        'Remember that classic car ownership is a journey, not just a purchase. You\'ll become part of a community of enthusiasts who share your passion.',
        'At Vintage Point, we specialize in helping buyers find and acquire the perfect classic car for their needs. Our curated selection, verified histories, and expert guidance ensure a smooth buying experience.',
        'Whether you\'re a first-time buyer or an experienced collector, we invite you to explore our current inventory and discover the timeless elegance of classic automobiles.',
        'Contact us today to start your classic car journey. Our team is ready to answer your questions and help you find your dream classic car.'
      ],
      contentAr: [
        'شراء سيارة كلاسيكية تجربة مجزية تجمع بين الشغف والاستثمار والتراث السيارات. مع البحث المناسب والفحص والصيانة، يمكن لسيارتك الكلاسيكية أن توفر سنوات من المتعة وربما تقدر في القيمة.',
        'تذكر أن ملكية السيارات الكلاسيكية هي رحلة، وليست مجرد شراء. ستصبح جزءًا من مجتمع من المتحمسين الذين يشاركونك شغفك.',
        'في Vintage Point، نحن متخصصون في مساعدة المشترين في العثور على السيارة الكلاسيكية المثالية واقتنائها لاحتياجاتهم. مجموعتنا المختارة والتواريخ الموثقة والإرشاد الخبير يضمنون تجربة شراء سلسة.',
        'سواء كنت مشتريًا لأول مرة أو جامعًا ذا خبرة، ندعوك لاستكشاف مخزوننا الحالي واكتشاف الأناقة الخالدة للسيارات الكلاسيكية.',
        'اتصل بنا اليوم لبدء رحلة السيارات الكلاسيكية الخاصة بك. فريقنا مستعد للإجابة على أسئلتك ومساعدتك في العثور على سيارتك الكلاسيكية الحلم.'
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-32 sm:pt-36 md:pt-40 pb-12 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-20"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gold-500 mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)] px-4">
            {isRTL ? 'دليل شراء السيارات الكلاسيكية' : 'Classic Car Buying Guide'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            {isRTL 
              ? 'دليل شامل لمساعدتك في اتخاذ قرار شراء مستنير وحكيم للسيارات الكلاسيكية'
              : 'A comprehensive guide to help you make an informed and wise classic car purchase decision'
            }
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 md:mb-16"
        >
          <Card className="border-2 border-gold-500/40 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                {isRTL ? 'المحتويات' : 'Table of Contents'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {sections.map((section, index) => {
                  const Icon = section.icon
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg hover:bg-gold-500/10 transition-colors group"
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gold-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base font-medium group-hover:text-gold-400 transition-colors">
                        {index + 1}. {isRTL ? section.titleAr : section.titleEn}
                      </span>
                    </a>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => {
          const Icon = section.icon
          const content = isRTL ? section.contentAr : section.contentEn
          const title = isRTL ? section.titleAr : section.titleEn

          return (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="mb-8 md:mb-12 lg:mb-16 scroll-mt-24"
            >
              <Card className="border-2 border-gold-500/40 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur hover:border-gold-500/70 hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] transition-all duration-300">
                <CardContent className="p-5 sm:p-6 md:p-8 lg:p-10">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 md:mb-7">
                    <div className="p-2 sm:p-3 rounded-full bg-gold-500/20 border-2 border-gold-500/40 flex-shrink-0">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-gold-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gold-400">
                      {index + 1}. {title}
                    </h2>
                  </div>
                  <div className="space-y-4 md:space-y-5 lg:space-y-6 text-muted-foreground leading-relaxed">
                    {content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-sm sm:text-base md:text-lg lg:text-xl leading-7 md:leading-8 lg:leading-9">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16 lg:mt-20"
        >
          <Card className="border-2 border-gold-500/60 bg-gradient-to-br from-gold-500/10 to-gold-600/10 backdrop-blur">
            <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400 mb-4 md:mb-6">
                {isRTL ? 'هل أنت مستعد لبدء رحلتك؟' : 'Ready to Start Your Journey?'}
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                {isRTL 
                  ? 'تصفح مجموعتنا المختارة من السيارات الكلاسيكية أو اتصل بنا للحصول على استشارة شخصية'
                  : 'Browse our curated collection of classic cars or contact us for personalized consultation'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <a href="/#cars" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                    <Car className="h-5 w-5 mr-2" />
                    {isRTL ? 'تصفح السيارات' : 'Browse Cars'}
                  </Button>
                </a>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971569141444'}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                    <Phone className="h-5 w-5 mr-2" />
                    {isRTL ? 'اتصل بنا' : 'Contact Us'}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
