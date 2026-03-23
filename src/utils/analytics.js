const gtag = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

export const trackScheduleDemo = (location) => {
  gtag('event', 'schedule_demo_click', {
    event_category: 'conversion',
    event_label: location,
  })
}

export const trackLeadCapture = (email) => {
  gtag('event', 'lead_capture', {
    event_category: 'conversion',
    event_label: email,
  })
}
