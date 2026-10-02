import { es } from './es'
import { en } from './en'

// Un idioma se publica solo cuando su diccionario existe.
const dictionaries = { es, en }

export const READY_LOCALES = Object.keys(dictionaries)

export function getDict(locale) {
  return dictionaries[locale]
}
