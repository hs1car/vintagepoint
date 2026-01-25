# Advanced Search & Filtering System | نظام البحث والفلترة المتقدم

## Overview | نظرة عامة

A comprehensive search and filtering system for cars and spare parts in the admin panel, supporting multiple filters, sorting, and pagination.

نظام بحث وفلترة شامل للسيارات وقطع الغيار في لوحة التحكم، يدعم فلاتر متعددة، ترتيب، وصفحات.

---

## Features | المميزات

### 🚗 Cars Search
- **Text Search**: Search by car model
- **Price Range**: Filter by min/max price
- **Year Range**: Filter by manufacturing year
- **Condition**: Filter by condition (Excellent, Very Good, Good, Fair)
- **Active Status**: Filter by active/inactive cars
- **Sorting**: Sort by newest, oldest, price (low to high), price (high to low)
- **Pagination**: Server-side pagination (20 items per page)

### 🔧 Spare Parts Search
- **Text Search**: Search by part name or description
- **Price Range**: Filter by min/max price
- **Active Status**: Filter by active/inactive parts
- **Sorting**: Sort by newest, oldest, price (low to high), price (high to low)
- **Pagination**: Server-side pagination (20 items per page)

---

## API Endpoints | نقاط النهاية

### 1. Cars Search API

**Endpoint**: `GET /api/cars/search`

**Query Parameters**:
```
q           - Search query (searches in model)
minPrice    - Minimum price filter
maxPrice    - Maximum price filter
minYear     - Minimum year filter
maxYear     - Maximum year filter
condition   - Filter by condition (Excellent, Very Good, Good, Fair)
isActive    - Filter by active status (true/false)
sortBy      - Sort field (createdAt, updatedAt, price, year)
sortOrder   - Sort direction (asc/desc)
page        - Page number (default: 1)
limit       - Items per page (default: 20)
```

**Example Request**:
```
GET /api/cars/search?q=BMW&minPrice=50000&maxPrice=200000&minYear=2010&condition=Excellent&sortBy=price&sortOrder=asc&page=1&limit=20
```

**Response**:
```json
{
  "cars": [
    {
      "id": "1",
      "model": "BMW 320i",
      "year": 2015,
      "condition": "Excellent",
      "price": 75000,
      "description": "...",
      "images": "...",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 45,
    "totalPages": 3,
    "hasMore": true
  },
  "filters": {
    "query": "BMW",
    "minPrice": 50000,
    "maxPrice": 200000,
    "minYear": 2010,
    "condition": "Excellent",
    "sortBy": "price",
    "sortOrder": "asc"
  }
}
```

---

### 2. Spare Parts Search API

**Endpoint**: `GET /api/parts/search`

**Query Parameters**:
```
q           - Search query (searches in name and description)
minPrice    - Minimum price filter
maxPrice    - Maximum price filter
isActive    - Filter by active status (true/false)
sortBy      - Sort field (createdAt, updatedAt, price, name)
sortOrder   - Sort direction (asc/desc)
page        - Page number (default: 1)
limit       - Items per page (default: 20)
```

**Example Request**:
```
GET /api/parts/search?q=brake&minPrice=100&maxPrice=5000&isActive=true&sortBy=price&sortOrder=asc&page=1
```

**Response**:
```json
{
  "parts": [
    {
      "id": "1",
      "name": "Brake Pads",
      "description": "...",
      "price": 250,
      "images": "...",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 12,
    "totalPages": 1,
    "hasMore": false
  },
  "filters": {
    "query": "brake",
    "minPrice": 100,
    "maxPrice": 5000,
    "isActive": true,
    "sortBy": "price",
    "sortOrder": "asc"
  }
}
```

---

## UI Components | مكونات الواجهة

### 1. CarSearchBar Component

**Location**: `src/components/admin/CarSearchBar.tsx`

**Props**:
```typescript
interface CarSearchBarProps {
  onSearch: (filters: CarSearchFilters) => void
  initialFilters?: Partial<CarSearchFilters>
  showActiveFilter?: boolean
}
```

**Filters Interface**:
```typescript
interface CarSearchFilters {
  query?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  condition?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: string
}
```

**Features**:
- Text search input with instant search on Enter
- Advanced filters panel (Sheet component)
- Price range inputs
- Year range inputs
- Condition selector
- Active status toggle
- Sort options (newest, oldest, price low/high)
- Active filter badges with quick remove
- Reset all filters button

---

### 2. PartSearchBar Component

**Location**: `src/components/admin/PartSearchBar.tsx`

**Props**:
```typescript
interface PartSearchBarProps {
  onSearch: (filters: PartSearchFilters) => void
  initialFilters?: Partial<PartSearchFilters>
  showActiveFilter?: boolean
}
```

**Filters Interface**:
```typescript
interface PartSearchFilters {
  query?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  sortBy?: string
  sortOrder?: string
}
```

**Features**:
- Text search input
- Advanced filters panel
- Price range inputs
- Active status toggle
- Sort options
- Active filter badges
- Reset filters

---

## Admin Pages | صفحات الإدارة

### 1. Cars Management Page

**Location**: `src/app/admin/cars/page.tsx`

**Features**:
- Server-side filtered and paginated car list
- Search by model
- Multiple filters (price, year, condition, status)
- Sort options
- Real-time search results
- Total count display
- Skeleton loading states
- Empty state with icon

**State Management**:
```typescript
const [cars, setCars] = useState<Car[]>([])
const [loading, setLoading] = useState(true)
const [totalCount, setTotalCount] = useState(0)
const [currentPage, setCurrentPage] = useState(1)
const [currentFilters, setCurrentFilters] = useState<CarSearchFilters>({})
```

---

### 2. Spare Parts Management Page

**Location**: `src/app/admin/parts/page.tsx`

**Features**:
- Server-side filtered and paginated parts list
- Search by name and description
- Price range filters
- Active status filter
- Sort options
- Total count display
- Loading and empty states

---

## Usage Examples | أمثلة الاستخدام

### Search for Cars

1. **Simple Text Search**:
   - Type "BMW" in search box
   - Press Enter or click "بحث"
   - Results show all cars with "BMW" in model name

2. **Advanced Filtering**:
   - Click "فلترة" button
   - Set price range: 50,000 - 200,000
   - Set year range: 2010 - 2020
   - Select condition: "Excellent"
   - Click "تطبيق الفلترة"

3. **Sorting**:
   - Open filters panel
   - Select "الترتيب": "الأقل سعراً" (Price Low to High)
   - Results are sorted by price ascending

4. **Filter Active/Inactive**:
   - Open filters panel
   - Toggle "نشط فقط" switch
   - Only active cars are shown

---

### Search for Spare Parts

1. **Text Search**:
   - Type "brake" in search box
   - Results show all parts with "brake" in name or description

2. **Price Filtering**:
   - Open filters panel
   - Set min price: 100
   - Set max price: 5000
   - Apply filters

3. **Reset Filters**:
   - Click "إعادة تعيين" button
   - All filters are cleared
   - Results show all parts

---

## Technical Details | التفاصيل التقنية

### Server-Side Pagination

Both APIs use server-side pagination to handle large datasets efficiently:

```typescript
const fetchCars = async (filters: CarSearchFilters = {}, page: number = 1) => {
  const params = new URLSearchParams()
  if (filters.query) params.append('q', filters.query)
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
  // ... more filters
  params.append('page', page.toString())
  params.append('limit', '20')

  const res = await fetch(`/api/cars/search?${params}`)
  const data = await res.json()
  
  setCars(data.cars)
  setTotalCount(data.pagination.totalCount)
  setCurrentPage(page)
}
```

### Database Queries

The search APIs use Prisma's filtering capabilities:

```typescript
const where = {
  ...(query && {
    OR: [
      { model: { contains: query, mode: 'insensitive' } }
    ]
  }),
  ...(minPrice && { price: { gte: minPrice } }),
  ...(maxPrice && { price: { lte: maxPrice } }),
  ...(condition && { condition }),
  ...(isActive !== undefined && { isActive })
}

const cars = await prisma.car.findMany({
  where,
  orderBy: { [sortBy]: sortOrder },
  skip: (page - 1) * limit,
  take: limit
})
```

### Rate Limiting

Both search endpoints are protected with rate limiting:
- **Preset**: RELAXED (100 requests per minute)
- **Purpose**: Prevent abuse while allowing frequent searches

---

## Performance Optimizations | تحسينات الأداء

1. **Server-Side Filtering**: All filtering done on database level
2. **Pagination**: Only loads 20 items at a time
3. **Debounced Search**: Could be added for real-time search
4. **Index Optimization**: Database indexes on searchable fields
5. **Lazy Loading**: Images loaded on demand

---

## Future Enhancements | تحسينات مستقبلية

1. **Pagination UI**: Add Previous/Next buttons
2. **Infinite Scroll**: Load more items on scroll
3. **Search Suggestions**: Auto-complete suggestions
4. **Save Searches**: Save favorite filter combinations
5. **Export Results**: Export filtered results to CSV/Excel
6. **Advanced Analytics**: Track popular searches
7. **Bulk Actions**: Select and modify multiple items
8. **Custom Views**: Save custom column layouts

---

## Testing | الاختبار

### Manual Testing Checklist

**Cars Search**:
- [ ] Search by model name
- [ ] Filter by price range
- [ ] Filter by year range
- [ ] Filter by condition
- [ ] Filter by active status
- [ ] Sort by different fields
- [ ] Clear all filters
- [ ] Navigate between pages
- [ ] Empty search results

**Parts Search**:
- [ ] Search by name
- [ ] Search by description
- [ ] Filter by price range
- [ ] Filter by active status
- [ ] Sort by different fields
- [ ] Clear filters
- [ ] Navigate pages

---

## Troubleshooting | حل المشاكل

### No Results Found
- Check if filters are too restrictive
- Try clearing filters with "إعادة تعيين"
- Verify database has matching records

### Slow Search
- Database might need indexing
- Check network connection
- Verify API rate limiting isn't blocking requests

### Filters Not Working
- Check browser console for errors
- Verify API endpoints are accessible
- Clear browser cache

---

## Related Documentation

- [Rate Limiting](./RATE_LIMITING.md) - API protection details
- [API Routes](./src/app/api/) - API implementation
- [Components](./src/components/) - UI components

---

## Support | الدعم

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check API response in Network tab
4. Verify database connectivity

---

**Last Updated**: December 2024
**Version**: 1.0.0
