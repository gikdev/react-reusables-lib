import { englifyNumber } from "./number"

export class PersianDate extends Date {
  toLocaleDateString = () => super.toLocaleDateString("fa-IR")
  getParts = () => super.toLocaleDateString().split("/")
  getDay = () => (super.getDay() === 6 ? 0 : super.getDay() + 1)
  getYear = () => this.getParts()[0]
  getMonthName = () => super.toLocaleDateString("fa-IR", { month: "long" })
  getDayName = () => super.toLocaleDateString("fa-IR", { weekday: "long" })
}

export const showFaDateProperly = (input?: string | null) =>
  input ? new PersianDate(input).toLocaleDateString() : "-"

export const showFaTimeProperly = (input?: string | null) =>
  input ? new PersianDate(input).toLocaleTimeString("fa-IR") : "-"

export function sumTimes(times: (string | null)[], config = { includeDays: false }): string {
  let td = 0
  let th = 0
  let tm = 0
  let ts = 0

  for (const time of times) {
    if (!time) continue

    let [d, h, m, s] = [0, 0, 0, 0]
    const hasDay = time.includes(".")

    if (hasDay) {
      d = Number(time.split(".")[0])
      const hms = time.split(".")[1]
      ;[h, m, s] = hms.split(":").map(item => Number(item))
    } else {
      ;[h, m, s] = time.split(":").map(item => Number(item))
    }

    td += d
    th += h
    tm += m
    ts += s
  }

  const [remainingS, minutedS] = [ts % 60, Math.floor(ts / 60)]
  ts = remainingS
  tm += minutedS

  const [remainingM, houredM] = [tm % 60, Math.floor(tm / 60)]
  tm = remainingM
  th += houredM

  const [remainingH, dayedH] = [th % 24, Math.floor(th / 24)]
  th = remainingH
  td += dayedH

  const addZero = (num: number) => num.toString().padStart(2, "0")

  if (config.includeDays) return `${td}.${addZero(th)}:${addZero(tm)}:${addZero(ts)}`

  return `${addZero(td * 24 + th)}:${addZero(tm)}:${addZero(ts)}`
}

// Generated by `GPT-4o mini`: DON'T TOUCH IT!!!
export function convertHoursToTimeFormat(hours: number): string {
  // Extract the integer part (whole hours)
  const wholeHours = Math.floor(hours)

  // Extract the decimal part and convert it to minutes
  const decimalPart = hours - wholeHours
  const minutes = Math.round(decimalPart * 60)

  // Format hours and minutes with leading zeros
  const formattedHours = String(wholeHours).padStart(2, "0")
  const formattedMinutes = String(minutes).padStart(2, "0")

  // Return the formatted time string
  return `${formattedHours}:${formattedMinutes}:00`
}

export interface UsefulTime {
  d: number
  h: number
  m: number
  s: number
}

/** Converts a time string `"D.HH:MM:SS"` to an object `{ d, h, m, s }` */
export function parseDHHMMSSString(timeStr: string): UsefulTime {
  let days = 0
  let hours = 0
  const [daysAndHours, minutes, seconds] = timeStr.split(":")

  const hasDays = daysAndHours.includes(".")
  if (hasDays) [days, hours] = daysAndHours.split(".").map(Number)
  else hours = Number(daysAndHours)

  return {
    d: days || 0,
    h: hours || 0,
    m: Number(minutes) || 0,
    s: Number(seconds) || 0,
  }
}

/** Converts a time object `{ d, h, m, s }` to a string `"D.HH:MM:SS"` */
export function formatDHMSObject(timeObj: UsefulTime): string {
  const { d, h, m, s } = timeObj
  const dayPart = `${d}.`
  const hourPart = String(h).padStart(2, "0")

  return `${dayPart}${hourPart}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function getCurrentMonthFa(): { name: string; code: number } {
  return {
    name: new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(),
    code: Number(englifyNumber(new Intl.DateTimeFormat("fa-IR", { month: "numeric" }).format())),
  }
}

export function getCurrentYearIR(): number {
  return Number(englifyNumber(new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format()))
}

export function numToMonthFa(num: number): string {
  switch (num) {
    case 1:
      return "فروردین"
    case 2:
      return "اردیبهشت"
    case 3:
      return "خرداد"
    case 4:
      return "تیر"
    case 5:
      return "مرداد"
    case 6:
      return "شهریور"
    case 7:
      return "مهر"
    case 8:
      return "آبان"
    case 9:
      return "آذر"
    case 10:
      return "دی"
    case 11:
      return "بهمن"
    case 12:
      return "اسفند"
    default:
      return "ناشناخته"
  }
}

export function getMonthsCodeTill(monthCode = getCurrentMonthFa().code) {
  const monthsCodes = []

  for (let i = 1; i <= monthCode; i++) {
    monthsCodes.push(i)
  }

  return monthsCodes
}

export function diffDateInDHHMMSSFormat(from: Date, to: Date): string {
  const MS_PER_SECOND = 1000
  const SECONDS_PER_MINUTE = 60
  const MINUTES_PER_HOUR = 60
  const HOURS_PER_DAY = 24

  // Define total milliseconds for each time unit
  const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE // 60,000
  const MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR // 3,600,000
  const MS_PER_DAY = MS_PER_HOUR * HOURS_PER_DAY // 86,400,000

  const diffMs = Math.abs(to.getTime() - from.getTime())

  const days = Math.floor(diffMs / MS_PER_DAY)
  const hours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR)
  const minutes = Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE)
  const seconds = Math.floor((diffMs % MS_PER_MINUTE) / MS_PER_SECOND)

  return `${days}.${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function isTheSameDay(from: string | Date, to: string | Date): boolean {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  // Check if the dates are valid
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new Error("Invalid date string provided")
  }

  return (
    fromDate.getFullYear() === toDate.getFullYear() &&
    fromDate.getMonth() === toDate.getMonth() &&
    fromDate.getDate() === toDate.getDate()
  )
}
