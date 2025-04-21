import { useCallback, useEffect, useState } from "react"

export function useOnClickOutside(
  refs: Array<React.RefObject<HTMLElement | null>>,
  handler: (e: Event) => void,
) {
  useEffect(() => {
    const listener = (e: Event) => {
      let isOutside = true

      for (const ref of refs) {
        const el = ref?.current

        if (el?.contains(e?.target as Node)) {
          isOutside = false
          break
        }
      }

      if (isOutside) handler(e)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    const cleanup = () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
    return cleanup
  }, [refs, handler])
}

export function useRandomThing<T = string>(things: T[], interval = 1000) {
  const [current, setCurrent] = useState<T>(() => {
    const randomIndex = Math.floor(Math.random() * things.length)
    return things[randomIndex]
  })

  useEffect(() => {
    if (things.length === 0) return

    const getRandomThing = () => {
      const randomIndex = Math.floor(Math.random() * things.length)
      setCurrent(things[randomIndex])
    }

    const intervalId = setInterval(getRandomThing, interval)

    return () => clearInterval(intervalId)
  }, [things, interval])

  return current
}

// Made by ChatGPT, DO NOT TOUCH IT!
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function useObjectState<ObjectType extends Record<string, any>>(initialState?: ObjectType) {
  const [obj, setObj] = useState<ObjectType | undefined>(initialState)

  const alterObj = useCallback(<K extends keyof ObjectType>(key: K, value: ObjectType[K]) => {
    setObj(prevObj => {
      if (!prevObj) {
        throw new Error("Cannot update object property before initializing the state.")
      }
      return {
        ...prevObj,
        [key]: value,
      }
    })
  }, [])

  return [obj, alterObj, setObj] as [
    typeof initialState extends undefined ? ObjectType | undefined : ObjectType,
    typeof alterObj,
    React.Dispatch<
      React.SetStateAction<
        typeof initialState extends undefined ? ObjectType | undefined : ObjectType
      >
    >,
  ]
}
