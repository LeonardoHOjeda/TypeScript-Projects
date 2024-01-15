import { useEffect, useRef } from 'react'

export const useScrollBlock = () => {
  const documentRef = useRef<Document>()
  const scrollBlocked = useRef(false)

  useEffect(() => {
    documentRef.current = document
  }, [])

  const blockScroll = (): void => {
    const html = documentRef.current!.documentElement
    const { body } = documentRef.current!
    if (!body?.style || scrollBlocked.current) return
    if (!document) return

    const scrollBarWidth = window.innerWidth - html.clientWidth
    const bodyPaddingRight = parseInt(window.getComputedStyle(body).getPropertyValue('padding-right')) || 0

    html.style.position = 'relative'
    html.style.overflow = 'hidden'
    body.style.position = 'relative'
    body.style.overflow = 'hidden'
    body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`

    scrollBlocked.current = true
  }

  const allowScroll = (): void => {
    const html = documentRef.current!.documentElement
    const { body } = documentRef.current!
    if (!body?.style || !scrollBlocked.current) return

    html.style.position = ''
    html.style.overflow = ''
    body.style.position = ''
    body.style.overflow = ''
    body.style.paddingRight = ''

    scrollBlocked.current = false
  }

  return { blockScroll, allowScroll }
}
