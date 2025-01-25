export function englifyNumber(number: string | number): string {
  return String(number)
    .replace(/۰/gi, "0")
    .replace(/۱/gi, "1")
    .replace(/۲/gi, "2")
    .replace(/۳/gi, "3")
    .replace(/۴/gi, "4")
    .replace(/۵/gi, "5")
    .replace(/۶/gi, "6")
    .replace(/۷/gi, "7")
    .replace(/۸/gi, "8")
    .replace(/۹/gi, "9")
    .replace(/\//gi, ".")
}

export function persianizeNumber(number: string | number, replaceDotsToo = true): string {
  let result = String(number)
  result = result.replace(/0/gi, "۰")
  result = result.replace(/1/gi, "۱")
  result = result.replace(/2/gi, "۲")
  result = result.replace(/3/gi, "۳")
  result = result.replace(/4/gi, "۴")
  result = result.replace(/5/gi, "۵")
  result = result.replace(/6/gi, "۶")
  result = result.replace(/7/gi, "۷")
  result = result.replace(/8/gi, "۸")
  result = result.replace(/9/gi, "۹")

  result = replaceDotsToo ? result.replace(/\./gi, "/") : result

  return result
}
