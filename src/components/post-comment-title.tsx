import { formatTimeToNow } from '@/lib/utils';
import { ExtendedComment } from '@/types/db';
import Link from 'next/link';
import { FC } from 'react';

type PostCommentTitleProps = {
  comment: ExtendedComment;
  showPostLink?: boolean;
};

const PostCommentTitle: FC<PostCommentTitleProps> = ({
  comment,
  showPostLink = false,
}) => {
  if (showPostLink && comment.Post) {
    return (
      <div className="ml-2 space-y-1">
        <div className="text-sm font-medium leading-none">
          <Link
            className=" text-gray-900 underline underline-offset-2"
            href={`/r/${comment.Post.subreddit.name}`}
          >
            r/{comment.Post.subreddit.name}
          </Link>
          <span className="mx-2">•</span>
          <Link
            className="text-sm font-medium text-gray-900 underline underline-offset-2"
            href={`/r/${comment.Post.subreddit.name}/post/${comment.Post.id}`}
          >
            {comment.Post.title}
          </Link>
        </div>
        <div className="flex items-center gap-x-2 gap-y-0 text-sm">
          <Link
            className="font-medium text-gray-900 underline underline-offset-2"
            href={`/u/${comment.author.username}`}
          >
            u/{comment.author.username}
          </Link>
          <p className="max-h-40 truncate text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-2 flex flex-wrap items-center gap-x-2 gap-y-0">
      <Link
        className="text-sm font-medium text-gray-900 underline underline-offset-2"
        href={`/u/${comment.author.username}`}
      >
        u/{comment.author.username}
      </Link>
      <p className="max-h-40 truncate text-sm text-zinc-500">
        {formatTimeToNow(new Date(comment.createdAt))}
      </p>
    </div>
  );
};

export default PostCommentTitle;
