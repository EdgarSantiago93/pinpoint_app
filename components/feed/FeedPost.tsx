import { FeedPostItem } from '@/hooks/use-feed-posts';
import { RankingPost } from './RankingPost';
import { VisitPostComponent } from './VisitPost';

interface FeedPostProps {
  post: FeedPostItem;
  onPress?: () => void;
  index?: number;
}

export function FeedPost({ post, onPress, index = 0 }: FeedPostProps) {
  switch (post.type) {
    case 'pinned_place':
      return <RankingPost post={post} onPress={onPress} index={index} />;
    case 'visit':
      return <VisitPostComponent post={post} onPress={onPress} index={index} />;
    default:
      return null;
  }
}
