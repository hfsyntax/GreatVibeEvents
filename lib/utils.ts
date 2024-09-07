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
