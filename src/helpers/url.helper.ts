export function getImageUrl(imageRelativePath?: string) {
  if (!imageRelativePath) return ''
  return `/api/files/get?path=${imageRelativePath}`;
}
