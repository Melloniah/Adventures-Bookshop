export function getImageUrl(path) {
  // If no path provided, return placeholder
  if (!path) return '/placeholder-product.jpg';
  
  // If it's already a full URL (http:// or https://), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Construct full API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // If path starts with /, use it directly
  if (path.startsWith('/')) {
    return `${baseUrl}${path}`;
  }
  
  // If it's just a filename, add /static/images/ prefix
  return `${baseUrl}/static/images/${path}`;
}

// Optional: Add this helper to handle image errors
export function handleImageError(e) {
  e.target.src = '/placeholder-product.jpg';
  e.target.onerror = null; // Prevent infinite loop if placeholder also fails
}