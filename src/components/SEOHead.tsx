'use client'

import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  price?: number
  currency?: string
  availability?: 'in stock' | 'out of stock'
  condition?: 'new' | 'used' | 'refurbished'
  brand?: string
  model?: string
  year?: number
}

export function SEOHead({
  title = 'Vintage Point L.L.C - Classic Cars & Spare Parts Dubai',
  description = 'Premium classic cars and genuine spare parts in Dubai. Luxury vintage automobiles, authentic car parts, professional service.',
  image = '/og-image.jpg',
  url = 'https://vintagepoint.ae',
  type = 'website',
  price,
  currency = 'USD',
  availability = 'in stock',
  condition,
  brand,
  model,
  year
}: SEOHeadProps) {
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'product' ? 'Product' : 'AutoDealer',
    name: title,
    description,
    image,
    url,
    ...(type === 'product' && price ? {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: availability === 'in stock' 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        itemCondition: condition === 'new'
          ? 'https://schema.org/NewCondition'
          : condition === 'refurbished'
          ? 'https://schema.org/RefurbishedCondition'
          : 'https://schema.org/UsedCondition'
      },
      brand: brand ? {
        '@type': 'Brand',
        name: brand
      } : undefined,
      model: model,
      productionDate: year,
      category: 'Classic Car'
    } : {}),
    ...(type === 'website' ? {
      '@type': 'AutoDealer',
      name: 'Vintage Point L.L.C',
      description: 'Premier classic car dealer in Dubai, UAE',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AE',
        addressLocality: 'Dubai'
      },
      telephone: '+971569141444',
      priceRange: '$$$',
      currenciesAccepted: 'USD,AED',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      openingHours: 'Mo-Su 09:00-21:00',
      areaServed: {
        '@type': 'Country',
        name: 'United Arab Emirates'
      }
    } : {})
  }

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content="classic cars dubai, vintage cars UAE, spare parts dubai, luxury cars, classic car dealer, vintage point" />
        <meta name="author" content="Vintage Point L.L.C" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English, Arabic" />
        <meta name="revisit-after" content="7 days" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Vintage Point L.L.C" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ar_AE" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />

        {/* Product-specific OG tags */}
        {type === 'product' && price && (
          <>
            <meta property="product:price:amount" content={price.toString()} />
            <meta property="product:price:currency" content={currency} />
            <meta property="product:availability" content={availability} />
            {condition && <meta property="product:condition" content={condition} />}
            {brand && <meta property="product:brand" content={brand} />}
          </>
        )}

        {/* Canonical */}
        <link rel="canonical" href={url} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    </>
  )
}
