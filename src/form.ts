export function handleImagePreview(
  e: React.ChangeEvent<HTMLInputElement>,
  urlSetter: React.Dispatch<React.SetStateAction<string>>,
  defaultImageUrl: string,
) {
  const file = e.target.files?.[0]
  const reader = new FileReader()

  reader.addEventListener("loadend", () => {
    urlSetter(typeof reader.result === "string" ? reader.result : defaultImageUrl)
  })

  if (file) reader.readAsDataURL(file)
  else urlSetter(defaultImageUrl)
}
