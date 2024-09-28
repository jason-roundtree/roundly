import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// TODO: change to .tsx, which requires a change with ref
export default function Portal({ children, selector }) {
  const ref = useRef()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.querySelector(selector)
    setMounted(true)
    // TODO: should this be set to false here?
    // return () => {
    //   setMounted(false)
    // }
  }, [selector])

  return mounted ? createPortal(children, ref.current) : null
}
