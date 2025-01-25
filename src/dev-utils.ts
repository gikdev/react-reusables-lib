import { useEffect } from "react"

export const useLogOnChange = <T>(sth: T) => useEffect(() => console.log(sth), [sth])

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function ghostLog(val: any) {
  console.log(val)
  return val
}
