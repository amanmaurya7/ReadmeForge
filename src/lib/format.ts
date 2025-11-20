export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  }
  return `${value}`
}

export function formatDate(date: string | number | Date): string {
  const instance = new Date(date)
  if (Number.isNaN(instance.getTime())) {
    return ''
  }
  return instance.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
