export const canUseAlphaCanvasVideo = () => {
  if (typeof navigator === 'undefined') return true

  const ua = String(navigator.userAgent || '')
  const isMobile =
    /android|iphone|ipad|ipod|mobile|windows phone|webos|blackberry/i.test(ua)
  const isAndroid = /android/i.test(ua)
  const isChromiumFamily = /(chrome|chromium|edga|opr|samsungbrowser)/i.test(ua)

  // Android Chromium browsers often render WebM alpha videos as opaque/black.
  if (isAndroid && isChromiumFamily) return false
  // Mobile browsers in general are inconsistent with alpha WebM + canvas rendering.
  if (isMobile) return false

  return true
}
