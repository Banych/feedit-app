'use client';

import PostComment from '@/components/post-comment';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { ExtendedComment } from '@/types/db';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowDown, BookCheck, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useRef } from 'react';

type CommentsFeedProps = {
  initialComments: ExtendedComment[];
  userId?: string;
  postId?: string;
};

const CommentsFeed: FC<CommentsFeedProps> = ({
  initialComments,
  userId,
  postId,
}) => {
  const lastCommentRef = useRef<HTMLElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastCommentRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ['comments-infinite-query'],
    queryFn: async ({ pageParam = 1 }) => {
      const newQueryParams = new URLSearchParams();
      newQueryParams.append('limit', '10');
      newQueryParams.append('page', pageParam.toString());
      if (userId) {
        newQueryParams.append('userId', userId);
      }
      if (postId) {
        newQueryParams.append('postId', postId);
      }
      const query = `/api/comments?${newQueryParams.toString()}`;

      const { data } = await axios.get(query);

      return data as ExtendedComment[];
    },
    getNextPageParam: (lastPage, pages, lastPageParams) => {
      if (lastPage.length < INFINITE_SCROLLING_PAGINATION_RESULTS) {
        return undefined;
      }

      return lastPageParams + 1;
    },
    initialPageParam: 1,
    initialData: { pages: [initialComments], pageParams: [1] },
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage]);

  const comments = data?.pages.flatMap((page) => page) ?? initialComments;

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment, index) => {
        const commentVotesAmount = comment.votes.reduce(
          (acc, vote) => acc + (vote.type === 'UP' ? 1 : -1),
          0
        );

        const commentVote = comment.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        return (
          <li key={comment.id} ref={comments.length - 1 === index ? ref : null}>
            <PostComment
              postId={comment.postId}
              comment={{
                ...comment,
                post: comment.Post,
              }}
              currentVote={commentVote?.type ?? null}
              votesAmount={commentVotesAmount}
              showPostLink
            />
          </li>
        );
      })}
      <div className="flex items-center justify-center gap-x-4 text-sm text-zinc-500">
        {isFetching ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Loading more comments...
          </>
        ) : hasNextPage ? (
          <>
            <ArrowDown className="size-4" />
            Scroll down to load more comments
          </>
        ) : (
          <>
            <BookCheck className="size-4" />
            No more comments to load
          </>
        )}
      </div>
    </ul>
  );
};

export default CommentsFeed;
