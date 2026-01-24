export default function CarSkeleton() {
  return (
    <div className="rounded-lg border border-gold-500/20 bg-card overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-muted" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-muted rounded w-3/4" />
        
        {/* Details */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        
        {/* Price */}
        <div className="h-6 bg-muted rounded w-1/3" />
        
        {/* Button */}
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  )
}
