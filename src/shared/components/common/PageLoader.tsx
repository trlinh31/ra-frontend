export default function PageLoader() {
  return (
    <div className='flex flex-col gap-4 w-full animate-pulse'>
      {/* Page header skeleton */}
      <div className='space-y-2'>
        <div className='bg-muted rounded-md w-48 h-7' />
        <div className='bg-muted rounded-md w-72 h-4' />
      </div>

      {/* Card skeleton */}
      <div className='space-y-4 bg-card shadow-sm p-6 border rounded-xl'>
        <div className='bg-muted rounded-md w-36 h-5' />
        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='space-y-2'>
              <div className='bg-muted rounded w-24 h-3.5' />
              <div className='bg-muted rounded-md w-full h-9' />
            </div>
          ))}
        </div>
      </div>

      {/* Second card skeleton */}
      <div className='space-y-3 bg-card shadow-sm p-6 border rounded-xl'>
        <div className='bg-muted rounded-md w-32 h-5' />
        <div className='bg-muted rounded-md w-full h-32' />
      </div>
    </div>
  );
}
