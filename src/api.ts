// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function fetcher(config: any) {
  return async (url: string) => {
    const res = await fetch(url, config)

    if (res.ok) {
      const data = await res.json()
      return data
    }

    throw new Error("An error occurred while fetching the data.")
  }
}

/** A tool to manage `fetch` & `SessionStorage` */
export class Fession<SavedDataType> {
  constructor(public keyName: string) {
    this.init()
  }

  init() {
    const isThere = this.read()

    if (isThere) return

    sessionStorage.setItem(this.keyName, "")
  }

  /** Reads from session, if not available, it will fetch */
  read(): SavedDataType | null {
    const item = sessionStorage.getItem(this.keyName)
    if (!item) return null
    return JSON.parse(item)
  }

  /** Writes to data part */
  write(data: SavedDataType) {
    const stuffToWrite = JSON.stringify(data)
    sessionStorage.setItem(this.keyName, stuffToWrite)
  }

  /** Clears */
  clear(deleteKeyToo = false) {
    if (deleteKeyToo) {
      sessionStorage.removeItem(this.keyName)
      return
    }

    sessionStorage.setItem(this.keyName, "")
  }
}
