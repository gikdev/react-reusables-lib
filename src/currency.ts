import { persianizeNumber } from "./number"
import { reverseString } from "./string"

export function priceToToman(price: string | number) {
  let _price = price
  _price = Number(_price)
  _price = Math.round(_price / 10)
  _price = persianizeNumber(_price)
  _price = addCommaToPrice(_price)

  return _price
}

export function addCommaCore(basePrice: string | number) {
  const splittedPrice = reverseString(basePrice.toString())
    .split(/(.{3})/)
    .filter(x => x)
  const result = splittedPrice
    .map(reverseString)
    .reverse()
    .map((part, i) => (i === splittedPrice.length - 1 ? part : `${part},`))
    .join("")
  return result
}

export function addCommaToPrice(price: string | number, decimalsLimit: boolean | number = false) {
  const _price = price.toString()
  // if the number has been splitted into 2 parts it means that it has decimals
  const hasDecimals = _price.split("/").length > 1
  const base = hasDecimals ? _price.split("/").at(0) : _price

  if (!base) return "BASE UNDEFINED"

  // if there's no decimal OR there's decimalLimit OR it's 0 return the base (without decimals)
  if (!hasDecimals || decimalsLimit === true || decimalsLimit === 0) return addCommaCore(base)

  const decimals = (() => {
    let _decimals = _price.split("/").at(-1)
    // if there's a limit, round decimals
    if (decimalsLimit) _decimals = _decimals?.slice(0, decimalsLimit)
    return _decimals
  })()

  return `${addCommaCore(base)}/${decimals}`
}
