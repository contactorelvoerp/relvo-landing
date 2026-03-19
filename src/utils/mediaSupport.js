export const canUseAlphaCanvasVideo = () => {
  if (typeof navigator === 'undefined') return true

  const ua = String(navigator.userAgent || '')
  const isAndroid = /android/i.test(ua)
  const isChromiumFamily = /(chrome|chromium|edga|opr|samsungbrowser)/i.test(ua)

  // Android Chromium browsers often render WebM alpha videos as opaque/black.
  if (isAndroid && isChromiumFamily) return false

  return true
}
