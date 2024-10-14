export function getPriceOfPercentage(price: number, percentage: number) {
  return price * (percentage / 100)
}

export function getPriceDifference(originalPrice: number, newPrice: number) {
  const difference = originalPrice - newPrice
  const percentSaved = Math.round((difference / originalPrice) * 100)
  return { dollarAmount: difference.toFixed(2), percent: percentSaved }
}

export function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor)
}

export function militaryToTime(militaryTime: string) {
  const [hours, minutes] = militaryTime.split(":")
  let hour = parseInt(hours)
  const ending = hour >= 12 ? "PM" : "AM"
  hour = hour % 12 || 12
  return `${hour}:${minutes} ${ending}`
}

export function exactDate(dateString: string) {
  let date = new Date(dateString)
  date.setHours(date.getHours() + 4)
  return date
}

export function isAdult(dateString: string) {
  const date = exactDate(dateString)
  const now = new Date()
  const eighteenYears = new Date(
    now.getFullYear() - 18,
    now.getMonth(),
    now.getDate(),
  )
  return date <= eighteenYears
}
