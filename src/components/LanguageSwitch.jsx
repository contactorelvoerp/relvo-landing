import { hrefFor } from '../routes'
import { languageCookie } from '../../shared/language.js'

export function LanguageSwitch({ locale, pageId }) {
  return (
    <div className="language-switch" role="group" aria-label={locale === 'es' ? 'Idioma' : 'Language'}>
      {['es', 'en'].map((language) => (
        <a
          key={language}
          className="language-switch__option"
          href={`${hrefFor(pageId, language) ?? hrefFor('home', language)}?lang=${language}`}
          hrefLang={language}
          lang={language}
          aria-label={language === 'es' ? 'ES — Español' : 'EN — English'}
          aria-current={locale === language ? 'true' : undefined}
          onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            document.cookie = languageCookie(language, location.protocol === 'https:')
            // Preserve campaign attribution without jumping to a previous section.
            const target = new URL(event.currentTarget.href)
            const current = new URL(location.href)
            current.searchParams.forEach((value, key) => { if (key !== 'lang') target.searchParams.append(key, value) })
            event.currentTarget.href = target.href
          }}
        >
          {language.toUpperCase()}
        </a>
      ))}
    </div>
  )
}
