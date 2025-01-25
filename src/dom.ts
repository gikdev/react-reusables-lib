type Clickullable = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement | null
const TIME_STEP = 200

export function goToThere(ids: string[], timeStep = TIME_STEP) {
  ids.forEach((id, i) => {
    setTimeout(() => {
      const target: Clickullable = document.querySelector(id)

      if (target?.tagName.toUpperCase() === "INPUT") target!.focus()

      target?.click()
    }, i * timeStep)
  })
}
