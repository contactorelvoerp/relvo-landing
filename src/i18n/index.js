import { es } from './es'

// Un idioma se publica solo cuando su diccionario existe. EN se suma acá
// cuando el copy en inglés esté aprobado (no se traduce por cuenta propia).
const dictionaries = { es }

export const READY_LOCALES = Object.keys(dictionaries)

export function getDict(locale) {
  return dictionaries[locale]
}
