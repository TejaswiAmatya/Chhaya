import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Story } from '../types/feed'
import { mockStories } from '../data/mockStories'
import { Topbar } from '../components/feed/Topbar'
import { LeftSidebar } from '../components/feed/LeftSidebar'
import { RightSidebar } from '../components/feed/RightSidebar'
import { FeedList } from '../components/feed/FeedList'
import { BottomNav } from '../components/feed/BottomNav'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface ApiStory {
  id: string
  content: string
  suneinCount: number
  createdAt: string
  _count?: { comments: number }
}

function mapApiStory(s: ApiStory): Story {
  return {
    id: s.id,
    circleId: 'SathiCircle',
    title: s.content.length > 60 ? s.content.slice(0, 60) + '...' : s.content,
    body: s.content,
    tags: [],
    flair: null,
    votes: s.suneinCount,
    comments: s._count?.comments ?? 0,
    createdAt: new Date(s.createdAt),
  }
}

export function Stories() {
  const [apiStories, setApiStories] = useState<Story[]>([])
  const [trendingStories, setTrendingStories] = useState<Story[]>([])
  const [searchParams] = useSearchParams()
  const q = (searchParams.get('q') ?? '').trim().toLowerCase()
  const isTrending = searchParams.get('trending') === 'true'

  useEffect(() => {
    fetch(`${API}/api/stories`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setApiStories((res.data as ApiStory[]).map(mapApiStory))
      })
      .catch((err) => console.error('Error loading stories:', err))
  }, [])

  useEffect(() => {
    if (!isTrending) return
    fetch(`${API}/api/stories/trending`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTrendingStories((res.data as ApiStory[]).map(mapApiStory))
      })
      .catch(() => {})
  }, [isTrending])

  async function handleNewStory(text: string) {
    try {
      const res = await fetch(`${API}/api/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: text }),
      })
      const json = await res.json()
      if (json.success) {
        setApiStories((prev) => [mapApiStory(json.data as ApiStory), ...prev])
      }
    } catch (err) {
      console.error('Error adding story:', err)
    }
  }

  const allStories = [...apiStories, ...mockStories]
  const stories = isTrending
    ? trendingStories
    : q
    ? allStories.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.body.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      )
    : allStories

  return (
    <div className="min-h-screen bg-pageBg font-sans">
      <Topbar />

      <div className="flex justify-center">
        {/* Left sidebar — hidden below md */}
        <aside className="hidden md:block w-[200px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <LeftSidebar />
        </aside>

        {/* Main feed */}
        <main className="flex-1 max-w-2xl bg-feedBg min-h-screen p-3 pb-20 md:pb-3">
          {isTrending && (
            <p className="text-xs font-semibold text-ink font-sans mb-2 px-1 flex items-center gap-1">
              🔥 Trending — pichlo 7 din ka sabai bhandaa suneko katha
            </p>
          )}
          {q && !isTrending && (
            <p className="text-xs text-textMuted font-sans mb-2 px-1">
              <span className="text-ink font-semibold">"{searchParams.get('q')}"</span> ko lagi{' '}
              <span className="text-ink font-semibold">{stories.length}</span> katha fyelayo
            </p>
          )}
          <FeedList stories={stories} onNewStory={handleNewStory} />
        </main>

        {/* Right sidebar — hidden below lg */}
        <aside className="hidden lg:block w-[260px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <RightSidebar />
        </aside>
      </div>

      <BottomNav />
    </div>
  )
}
