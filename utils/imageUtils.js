
export function getImageUrl(path) {
  console.log('🔍 Original path from DB:', path);
  
  // If no path provided, return null
  if (!path) return null;
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Remove leading slash if present, then check
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // If it's the path from DB (static/images/...)
  if (cleanPath.startsWith('static/images/')) {
    const fullUrl = `${baseUrl}/${cleanPath}`;
    console.log('✅ Final URL:', fullUrl);
    return fullUrl;
  }
  
  // If it's just a filename, add the full path
  const fullUrl = `${baseUrl}/static/images/${cleanPath}`;
  console.log('✅ Final URL:', fullUrl);
  return fullUrl;
}

// Inline SVG placeholder - gray box with "No Image" text
const placeholderSVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23666666"%3ENo Image%3C/text%3E%3C/svg%3E';

export function handleImageError(e) {
  e.target.src = placeholderSVG;
  e.target.onerror = null; // Prevent infinite loop
}

// Optional: Export the placeholder for use in conditional rendering
export { placeholderSVG };