import type { Story } from '../../types/feed'
import { PostCard } from './PostCard'
import { BentoBlock } from './BentoBlock'
import { StoryInput } from './StoryInput'

export function FeedList({
  stories,
  onNewStory,
}: {
  stories: Story[]
  onNewStory: (text: string) => void
}) {
  const items: React.ReactNode[] = []

  items.push(<StoryInput key="input" onSubmit={onNewStory} />)
  items.push(<BentoBlock key="bento-0" variant={0} />)

  stories.forEach((story) => {
    items.push(<PostCard key={story.id} story={story} />)
  })

  return <div className="flex flex-col gap-2">{items}</div>
}
