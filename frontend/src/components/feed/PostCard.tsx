import { useState, useRef } from 'react'
import type { Story } from '../../types/feed'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
import { circles, relativeTime } from '../../data/mockStories'

/** Simple heuristic: if text contains Devanagari chars, it's Nepali → translate to English */
function detectTargetLang(text: string): 'en' | 'ne' {
  return /[\u0900-\u097F]/.test(text) ? 'en' : 'ne'
}

export function PostCard({ story }: { story: Story }) {
  const [listened, setListened] = useState(false)
  const [voted, setVoted] = useState(false)
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Translation state
  const [translatedBody, setTranslatedBody] = useState<string | null>(null)
  const [showTranslated, setShowTranslated] = useState(false)
  const [translating, setTranslating] = useState(false)

  const circle = circles.find((c) => c.id === story.circleId)
  const voteCount = voted ? story.votes + 1 : story.votes

  async function handleSunein(e: React.MouseEvent<HTMLButtonElement>) {
    if (listened) return
    const rect = e.currentTarget.getBoundingClientRect()
    setRipplePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setListened(true)
    setTimeout(() => setRipplePos(null), 500)

    try {
      await fetch(`${API}/api/stories/${story.id}/sunein`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Error incrementing sunein:', err)
    }
  }

  async function handleTranslate() {
    // If already translated, just toggle display
    if (translatedBody) {
      setShowTranslated((prev) => !prev)
      return
    }

    setTranslating(true)
    try {
      const targetLang = detectTargetLang(story.body)
      const res = await fetch(`${API}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: story.body, targetLang }),
      })
      const data = await res.json()
      if (data.success) {
        setTranslatedBody(data.data.translated)
        setShowTranslated(true)
      }
    } catch (err) {
      console.error('Translation error:', err)
    } finally {
      setTranslating(false)
    }
  }

  return (
    <article className="bg-pageBg rounded-xl border border-sand p-3 hover:border-textMuted transition-colors duration-150">
      {/* Meta row */}
      <div className="flex items-center gap-1.5 text-xs">
        {circle && (
          <>
            <div className={`w-4 h-4 rounded-full ${circle.color} flex items-center justify-center shrink-0`}>
              <span className="text-white text-[8px] font-bold font-serif">{circle.initial}</span>
            </div>
            <span className="font-semibold text-ink">c/{circle.id}</span>
          </>
        )}
        <span className="w-1 h-1 bg-textMuted rounded-full" />
        <span className="text-textMuted">{relativeTime(story.createdAt)}</span>
        {story.flair && (
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full ml-auto"
            style={{ backgroundColor: story.flair.bg, color: story.flair.text }}
          >
            {story.flair.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-serif font-bold text-[15px] text-ink leading-tight mt-1.5 line-clamp-2">
        {story.title}
      </h3>

      {/* Body preview */}
      <p className="text-xs text-textBody leading-relaxed mt-1 line-clamp-3">
        {story.body}
      </p>

      {/* Translated text */}
      {showTranslated && translatedBody && (
        <div className="mt-1.5 p-2 rounded-lg bg-marigold/10 border border-marigold/20">
          <span className="text-[9px] text-textMuted font-semibold uppercase tracking-wide">
            Translated
          </span>
          <p className="text-xs text-textBody leading-relaxed mt-0.5 italic">
            {translatedBody}
          </p>
        </div>
      )}

      {/* Tags */}
      {story.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {story.tags.map((tag) => (
            <span key={tag} className="text-[9px] bg-feedBg text-textMuted rounded-full px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-1.5 mt-2">
        {/* Vote */}
        <button
          onClick={() => setVoted((v) => !v)}
          className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs font-semibold text-ink hover:bg-sand/50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2L12 8H2L7 2Z" fill={voted ? '#C0392B' : '#9A7B5A'} />
          </svg>
          {voteCount}
        </button>

        {/* Comments */}
        <button className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody hover:bg-sand/50 transition-colors">
          <span className="text-sm">💬</span>
          {story.comments}
        </button>

        {/* Translate */}
        <button
          onClick={handleTranslate}
          disabled={translating}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            showTranslated
              ? 'bg-marigold/20 text-marigold border border-marigold/30'
              : 'bg-feedBg text-textBody hover:bg-sand/50'
          }`}
        >
          {translating ? (
            <span className="text-textMuted">Anuwad gardai...</span>
          ) : (
            <>
              <span className="text-sm">अ/A</span>
              {showTranslated ? 'Original' : 'Translate'}
            </>
          )}
        </button>

        {/* Maile Sunein */}
        <button
          ref={btnRef}
          onClick={handleSunein}
          className={`relative overflow-hidden rounded-full px-3 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors ${
            listened ? 'bg-ink text-pageBg' : 'bg-ink text-pageBg hover:opacity-90'
          }`}
        >
          {ripplePos && (
            <span
              className="absolute w-4 h-4 bg-sindoor/40 rounded-full animate-ripple pointer-events-none"
              style={{ left: ripplePos.x - 8, top: ripplePos.y - 8 }}
            />
          )}
          {listened ? 'सुनिएको ✓' : '🙏 Maile Sunein'}
        </button>

        {/* Share */}
        <button className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody hover:bg-sand/50 transition-colors ml-auto">
          ↗ Share
        </button>
      </div>
    </article>
  )
}
