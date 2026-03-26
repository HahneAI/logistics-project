export function timeAgo(offsetMinutes) {
  const abs = Math.abs(offsetMinutes)
  if (abs < 1)  return 'JUST NOW'
  if (abs < 60) return `${abs}m AGO`
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return m > 0 ? `${h}h ${m}m AGO` : `${h}h AGO`
}

const SHIFT_BASELINE_MIN = 424 // 7 hr 4 min — pre-shift offset for demo realism

export function shiftDuration(shiftStart) {
  const elapsed = Math.floor((Date.now() - new Date(shiftStart).getTime()) / 60000)
  const total   = elapsed + SHIFT_BASELINE_MIN
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${h} hr ${m} min`
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
