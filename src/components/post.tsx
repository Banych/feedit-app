import EditorOutput from '@/components/editor-output';
import PostVoteClient from '@/components/post-vote/post-vote-client';
import { cn, formatTimeToNow } from '@/lib/utils';
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
  const postRef = useRef<HTMLAnchorElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex flex-col justify-between px-3 py-2 sm:flex-row md:px-6 md:py-4">
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
            <span>
              Posted by{' '}
              <Link
                href={`/u/${post.author.username}`}
                className="text-zinc-900 underline underline-offset-2"
              >
                u/{post.author.username}
              </Link>
            </span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <Link href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
              {post.title}
            </h1>
          </Link>
          <Link
            href={`/r/${subredditName}/post/${post.id}`}
            className="relative block max-h-40 w-full overflow-y-clip text-sm"
            ref={postRef}
          >
            <EditorOutput
              content={post.content}
              isSmall
              className={cn(
                postRef.current &&
                  postRef.current?.clientHeight >= 160 &&
                  'pointer-events-none'
              )}
            />
            {postRef.current && postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </Link>
        </div>
      </div>
      <div className="z-20 bg-gray-50 px-2 py-1 text-sm sm:px-6 md:p-4">
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
