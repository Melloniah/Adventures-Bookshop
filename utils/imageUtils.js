const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Inline SVG placeholder - gray box with "No Image" text
const placeholderSVG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" dy=".3em" fill="%23666666"%3ENo Image%3C/text%3E%3C/svg%3E';

/**
 * Returns a full image URL for Next.js <Image> or null if invalid.
 * @param {string} path - Filename, relative path, or full URL
 * @returns {string|null}
 */

export function getImageUrl(path) {
  if (!path) return null;

  // Already a full URL (Cloudinary or any external URL)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path; // ✅ Return as-is
  }

  // Local backend image path
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (cleanPath.startsWith("static/images/")) {
    return `${baseUrl}/${cleanPath}`;
  }

  // Assume it's just a filename (old format)
  return `${baseUrl}/static/images/${cleanPath}`;
}

/**
 * Handles broken images by replacing with a placeholder.
 */
export function handleImageError(e) {
  if (e?.target) {
    e.target.src = placeholderSVG;
    e.target.onerror = null; // prevent infinite loop
  }
}

export { placeholderSVG };
