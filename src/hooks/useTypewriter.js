import { useState, useEffect, useRef } from 'react'

export const useTypewriter = (phrases, options = {}) => {
  const {
    // Valores en milisegundos
    typeSpeed = 70,            // tiempo entre cada letra al escribir (más rápido que humano)
    deleteSpeed = 35,          // tiempo entre cada letra al borrar (aún más rápido)
    delayAtEnd = 1800,         // pausa cuando termina una frase
    delayBetweenPhrases = 1600, // pausa antes de comenzar la siguiente
  } = options

  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]

    const type = () => {
      if (isDeleting) {
        setText(prev => prev.slice(0, -1))
        
        if (text === '') {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
          timeoutRef.current = setTimeout(type, delayBetweenPhrases)
          return
        }
        
        timeoutRef.current = setTimeout(type, deleteSpeed)
      } else {
        setText(currentPhrase.slice(0, text.length + 1))
        
        if (text === currentPhrase) {
          setIsDeleting(true)
          timeoutRef.current = setTimeout(type, delayAtEnd)
          return
        }
        
        timeoutRef.current = setTimeout(type, typeSpeed)
      }
    }

    timeoutRef.current = setTimeout(type, typeSpeed)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, isDeleting, phraseIndex, phrases, typeSpeed, deleteSpeed, delayAtEnd, delayBetweenPhrases])

  return text
}

