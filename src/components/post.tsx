import EditorOutput from '@/components/editor-output';
import PostVoteClient from '@/components/post-vote/post-vote-client';
import { formatTimeToNow } from '@/lib/utils';
import { Post as PostType, User, Vote } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { FC, useRef } from 'react';

type PartialVote = Pick<Vote, 'type'>;

type PostProps = {
  subredditName: string;
  post: PostType & {
    author: User;
    votes: Vote[];
  };
  commentAmount: number;
  votesAmount: number;
  currentVote?: PartialVote;
};

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmount,
  votesAmount,
  currentVote,
}) => {
  const postRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex flex-col justify-between px-6 py-4 sm:flex-row">
        <PostVoteClient
          initialVotesAmount={votesAmount}
          postId={post.id}
          initialVote={currentVote?.type}
        />

        <div className="w-full flex-1 sm:w-0">
          <div className="mt-1 max-h-40 text-xs text-gray-500">
            {subredditName ? (
              <>
                <Link
                  href={`/r/${subredditName}`}
                  className="text-sm text-zinc-900 underline underline-offset-2"
                >
                  r/{subredditName}
                </Link>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <Link href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
              {post.title}
            </h1>
          </Link>
          <div
            className="relative max-h-40 w-full overflow-y-clip text-sm"
            ref={postRef}
          >
            <EditorOutput content={post.content} isSmall />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="z-20 bg-gray-50 p-4 text-sm sm:px-6">
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <MessageSquare className="size-4" /> {commentAmount} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
