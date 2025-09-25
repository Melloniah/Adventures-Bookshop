export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder-product.jpg'; // Fallback image in public folder
  }
  
  // If already a complete URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If starts with /, it's already properly formatted
  if (imagePath.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
  }
  
  // If it's just a filename, construct the full path
  return `${process.env.NEXT_PUBLIC_API_URL}/static/images/${imagePath}`;
};