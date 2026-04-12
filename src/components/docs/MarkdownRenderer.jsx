import { Fragment } from 'react'
import { resolveMarkdownHref, slugifyHeading } from '../../docs/docsContent'

const paragraphBreak = /\n{2,}/

const parseBlocks = (markdown) => {
  const lines = markdown.split('\n')
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const language = line.replace(/^```/, '').trim()
      index += 1
      const content = []
      while (index < lines.length && !lines[index].startsWith('```')) {
        content.push(lines[index])
        index += 1
      }
      index += 1
      blocks.push({ type: 'code', language, content: content.join('\n') })
      continue
    }

    if (/^###\s+/.test(line)) {
      blocks.push({ type: 'h3', text: line.replace(/^###\s+/, '').trim() })
      index += 1
      continue
    }

    if (/^##\s+/.test(line)) {
      blocks.push({ type: 'h2', text: line.replace(/^##\s+/, '').trim() })
      index += 1
      continue
    }

    if (/^#\s+/.test(line)) {
      blocks.push({ type: 'h1', text: line.replace(/^#\s+/, '').trim() })
      index += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      const content = []
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        content.push(lines[index].replace(/^>\s?/, ''))
        index += 1
      }
      blocks.push({ type: 'blockquote', text: content.join(' ').trim() })
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, '').trim())
        index += 1
      }
      blocks.push({ type: 'olist', items })
      continue
    }

    const paragraph = []
    while (index < lines.length) {
      const current = lines[index]
      if (
        !current.trim() ||
        current.startsWith('```') ||
        /^#{1,3}\s+/.test(current) ||
        /^>\s?/.test(current) ||
        /^\d+\.\s+/.test(current)
      ) {
        break
      }
      paragraph.push(current)
      index += 1
    }

    blocks.push({ type: 'paragraph', text: paragraph.join('\n').trim() })
  }

  return blocks
}

const renderInline = (text, currentDocPath, navigate) => {
  const tokens = []
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index))
    }

    if (match[2] && match[3]) {
      const href = resolveMarkdownHref(currentDocPath, match[3])
      const isInternal = typeof href === 'string' && href.startsWith('/docs')
      tokens.push(
        <a
          key={`${match.index}-${href}`}
          href={href}
          onClick={isInternal ? (event) => {
            event.preventDefault()
            navigate?.(href)
          } : undefined}
          className="text-[var(--text-main)] underline decoration-[rgba(19,19,30,0.25)] underline-offset-4 transition hover:decoration-[rgba(19,19,30,0.55)]"
        >
          {match[2]}
        </a>,
      )
    } else if (match[4]) {
      tokens.push(
        <code
          key={`${match.index}-${match[4]}`}
          className="rounded-md bg-[rgba(19,19,30,0.06)] px-1.5 py-0.5 font-[var(--font-mono)] text-[0.9em] text-[var(--text-main)]"
        >
          {match[4]}
        </code>,
      )
    } else if (match[5]) {
      tokens.push(
        <strong key={`${match.index}-${match[5]}`} className="font-semibold text-[var(--text-main)]">
          {match[5]}
        </strong>,
      )
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex))
  }

  return tokens.map((token, idx) => (
    typeof token === 'string'
      ? <Fragment key={`text-${idx}`}>{token}</Fragment>
      : token
  ))
}

export const MarkdownRenderer = ({ markdown, currentDocPath, navigate }) => {
  const blocks = parseBlocks(markdown)

  return (
    <div className="docs-markdown">
      {blocks.map((block, index) => {
        if (block.type === 'h1') {
          return (
            <h1
              key={`h1-${index}`}
              className="text-[clamp(2.2rem,4vw,3.9rem)] font-normal leading-[1.02] tracking-[-0.04em] text-[var(--text-main)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {block.text}
            </h1>
          )
        }

        if (block.type === 'h2') {
          return (
            <h2
              key={`h2-${index}`}
              id={slugifyHeading(block.text)}
              className="mt-14 scroll-mt-28 text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--text-main)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {block.text}
            </h2>
          )
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={`h3-${index}`}
              className="mt-10 text-[1.1rem] font-semibold tracking-[-0.02em] text-[var(--text-main)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {block.text}
            </h3>
          )
        }

        if (block.type === 'paragraph') {
          const paragraphs = block.text.split(paragraphBreak)
          return (
            <div key={`p-${index}`} className="mt-5 space-y-5">
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={`paragraph-${paragraphIndex}`}
                  className="text-[1rem] leading-8 text-[var(--text-soft)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {renderInline(paragraph, currentDocPath, navigate)}
                </p>
              ))}
            </div>
          )
        }

        if (block.type === 'olist') {
          return (
            <ol
              key={`ol-${index}`}
              className="mt-5 space-y-3 pl-6 text-[1rem] leading-7 text-[var(--text-soft)] marker:font-medium marker:text-[var(--text-main)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`item-${itemIndex}`}>{renderInline(item, currentDocPath, navigate)}</li>
              ))}
            </ol>
          )
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote
              key={`quote-${index}`}
              className="mt-6 rounded-[var(--radius-lg)] border border-[rgba(19,19,30,0.08)] bg-[rgba(208,255,11,0.12)] px-5 py-4 text-[0.98rem] leading-7 text-[var(--text-main)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {renderInline(block.text, currentDocPath, navigate)}
            </blockquote>
          )
        }

        if (block.type === 'code') {
          return (
            <pre
              key={`code-${index}`}
              className="mt-6 overflow-x-auto rounded-[var(--radius-xl)] border border-[rgba(19,19,30,0.08)] bg-[var(--surface-dark)] px-5 py-4 text-[0.88rem] leading-6 text-[var(--text-on-dark)]"
            >
              <code style={{ fontFamily: 'var(--font-mono)' }}>{block.content}</code>
            </pre>
          )
        }

        return null
      })}
    </div>
  )
}
