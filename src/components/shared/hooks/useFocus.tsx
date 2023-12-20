import { useRef } from 'react'

// TODO: finish implementing
const useFocus = () => {
  const htmlElRef = useRef<HTMLElement>(null)
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus()
  }
  return [htmlElRef, setFocus]
}

export default useFocus
