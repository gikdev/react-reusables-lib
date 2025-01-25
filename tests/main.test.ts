import { describe, expect, it } from "vitest"
import {
  diffDateInDHHMMSSFormat,
  formatDHMSObject,
  isTheSameDay,
  parseDHHMMSSString,
  sumTimes,
} from "../src/date-time"

describe("DHMS stuff", () => {
  describe("formatDHMSObject()", () => {
    it("should format properly", () => {
      expect(formatDHMSObject({ d: 0, h: 0, m: 0, s: 0 })).toBe("0.00:00:00")
      expect(formatDHMSObject({ d: 1, h: 0, m: 0, s: 0 })).toBe("1.00:00:00")
      expect(formatDHMSObject({ d: 0, h: 19, m: 0, s: 0 })).toBe("0.19:00:00")
      expect(formatDHMSObject({ d: 0, h: 19, m: 2, s: 0 })).toBe("0.19:02:00")
      expect(formatDHMSObject({ d: 0, h: 19, m: 2, s: 58 })).toBe("0.19:02:58")
    })

    it.todo("should be smart enough to know to format overflowing values...", () => {
      expect(formatDHMSObject({ d: 0, h: 0, m: 0, s: 60 })).toBe("0.00:01:00")
      expect(formatDHMSObject({ d: 0, h: 0, m: 92, s: 0 })).toBe("0.01:32:00")
    })
  })

  describe("parseDHHMMSSString()", () => {
    it("should parse properly", () => {
      expect(parseDHHMMSSString("0.00:00:00")).toEqual({ d: 0, h: 0, m: 0, s: 0 })
      expect(parseDHHMMSSString("1.00:00:00")).toEqual({ d: 1, h: 0, m: 0, s: 0 })
      expect(parseDHHMMSSString("0.19:00:00")).toEqual({ d: 0, h: 19, m: 0, s: 0 })
      expect(parseDHHMMSSString("0.19:02:00")).toEqual({ d: 0, h: 19, m: 2, s: 0 })
      expect(parseDHHMMSSString("0.19:02:58")).toEqual({ d: 0, h: 19, m: 2, s: 58 })
    })
  })
})

describe("sumTimes", () => {
  it('should return "00:00:00" for an empty array', () => {
    expect(sumTimes([])).toBe("00:00:00")
  })

  it("should handle null values in the array", () => {
    expect(sumTimes([null, null, null])).toBe("00:00:00")
  })

  it("should sum simple times correctly", () => {
    expect(sumTimes(["01:30:15", "02:15:30"])).toBe("03:45:45")
    expect(sumTimes(["00:45:15", "00:15:30", "00:00:15"])).toBe("01:01:00")
  })

  it("should handle days correctly when includeDays is true", () => {
    expect(sumTimes(["1.02:30:15", "0.01:15:30"], { includeDays: true })).toBe("1.03:45:45")
    expect(sumTimes(["0.00:45:15", "0.00:15:30", "0.00:00:15"], { includeDays: true })).toBe(
      "0.01:01:00",
    )
  })

  it("should handle days correctly when includeDays is false", () => {
    expect(sumTimes(["1.02:30:15", "0.01:15:30"])).toBe("27:45:45") // 1 day = 24 hours
    expect(sumTimes(["0.00:45:15", "0.00:15:30", "0.00:00:15"])).toBe("01:01:00")
  })

  it("should correctly handle overflow of seconds, minutes, and hours", () => {
    expect(sumTimes(["00:59:59", "00:00:01"])).toBe("01:00:00")
    expect(sumTimes(["00:59:59", "01:00:01"])).toBe("02:00:00")
    expect(sumTimes(["1.23:59:59", "0.00:00:01"], { includeDays: true })).toBe("2.00:00:00")
  })

  it("should handle mixed time formats correctly", () => {
    expect(sumTimes(["0.01:00:00", "1:02:00", "0.00:30:00"], { includeDays: true })).toBe(
      "0.02:32:00",
    )
  })
})

describe("isTheSameDay", () => {
  it("should return true for the same day", () => {
    expect(isTheSameDay("2025-01-01T00:00:00", "2025-01-01T23:59:59")).toBe(true)
    expect(isTheSameDay("2025-01-01T12:00:00", "2025-01-01T00:00:00")).toBe(true)
  })

  it("should return false for different days", () => {
    expect(isTheSameDay("2025-01-01T00:00:00", "2025-01-02T00:00:00")).toBe(false)
    expect(isTheSameDay("2025-01-01T00:00:00", "2025-02-01T00:00:00")).toBe(false)
    expect(isTheSameDay("2025-01-31T00:00:00", "2025-02-01T00:00:00")).toBe(false)
  })

  it("should handle invalid date strings", () => {
    expect(() => isTheSameDay("invalid-date", "2025-01-01T00:00:00")).toThrow(
      "Invalid date string provided",
    )
    expect(() => isTheSameDay("2025-01-01T00:00:00", "invalid-date")).toThrow(
      "Invalid date string provided",
    )
  })
})

describe("Date functions tests", () => {
  describe("diffDates", () => {
    it("should return correct difference for two dates", () => {
      const date1 = new Date("2025-01-01T00:00:00Z")
      const date2 = new Date("2025-01-02T01:30:45Z")
      expect(diffDateInDHHMMSSFormat(date1, date2)).toBe("1.01:30:45")
    })

    it("should return correct difference when dates are the same", () => {
      const date1 = new Date("2025-01-01T00:00:00Z")
      const date2 = new Date("2025-01-01T00:00:00Z")
      expect(diffDateInDHHMMSSFormat(date1, date2)).toBe("0.00:00:00")
    })

    it("should return correct difference for negative duration", () => {
      const date1 = new Date("2025-01-02T01:30:45Z")
      const date2 = new Date("2025-01-01T00:00:00Z")
      expect(diffDateInDHHMMSSFormat(date1, date2)).toBe("1.01:30:45")
    })

    it("should handle differences that span multiple days", () => {
      const date1 = new Date("2025-01-01T00:00:00Z")
      const date2 = new Date("2025-01-04T12:15:30Z")
      expect(diffDateInDHHMMSSFormat(date1, date2)).toBe("3.12:15:30")
    })

    it("should handle differences that include hours, minutes, and seconds", () => {
      const date1 = new Date("2025-01-01T10:15:30Z")
      const date2 = new Date("2025-01-02T12:45:15Z")
      expect(diffDateInDHHMMSSFormat(date1, date2)).toBe("1.02:29:45")
    })

    it("should handle differences that include only seconds", () => {
      const date1 = new Date("2025-01-01T00:00:00Z")
      const date2 = new Date("2025-01-01T00:00:45Z")
      expect(diffDateInDHHMMSSFormat(date1, date2)).toBe("0.00:00:45")
    })

    it("should handle large differences correctly", () => {
      const date1 = new Date("2010-01-01T00:00:00Z")
      const date2 = new Date("2025-01-01T00:01:00Z")
      expect(diffDateInDHHMMSSFormat(date1, date2)).toBe("5479.00:01:00") // 9255 days
    })
  })
})
