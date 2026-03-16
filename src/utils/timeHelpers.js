export function timeAgo(offsetMinutes) {
  const abs = Math.abs(offsetMinutes)
  if (abs < 1)  return 'JUST NOW'
  if (abs < 60) return `${abs}m AGO`
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return m > 0 ? `${h}h ${m}m AGO` : `${h}h AGO`
}

export function shiftDuration(shiftStart) {
  const diffMs  = Date.now() - new Date(shiftStart).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function logTimestamp(offsetMinutes) {
  const d = new Date(Date.now() + offsetMinutes * 60000)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function nowTimestamp() {
  return new Date().toLocaleTimeString('en-US', { hour12: false })
}

// Slightly randomize a number by ±variance for the simulated live refresh effect
export function jitter(value, variance = 3) {
  return Math.max(0, value + Math.floor((Math.random() - 0.5) * variance * 2))
}
