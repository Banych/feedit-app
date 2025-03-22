'use client';

import CommentVotes from '@/components/comment-votes';
import PostCommentTitle from '@/components/post-comment-title';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/user-avatar';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PostCommentPayload } from '@/lib/validators/comment';
import { ExtendedComment } from '@/types/db';
import { VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ClassValue } from 'clsx';
import { ArrowBigRight, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';
import { FC, useEffect, useRef, useState } from 'react';

type PostCommentProps = {
  comment: ExtendedComment;
  votesAmount: number;
  currentVote: VoteType | null;
  postId: string;
  showPostLink?: boolean;
  className?: ClassValue;
};

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmount,
  currentVote,
  postId,
  showPostLink = false,
  className,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);

  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState('');

  const { push, refresh } = useRouter();
  const { data: session } = useSession();

  const { mutate: commentFn, isPending: isCommentLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: PostCommentPayload) => {
      const payload: PostCommentPayload = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        '/api/subreddit/post/comment',
        payload
      );
      return data;
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Failed to comment',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      refresh();
      setIsReplying(false);
      setInput('');
    },
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const commentId = url.hash.replace('#', '');

    if (commentRef.current && commentId === comment.id) {
      commentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [comment.id]);

  return (
    <div ref={commentRef} className={cn('flex flex-col', className)}>
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="size-6"
        />
        <PostCommentTitle comment={comment} showPostLink={showPostLink} />
      </div>
      <p className="mt-2 text-sm text-zinc-900">{comment.text}</p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CommentVotes
            commentId={comment.id}
            initialVotesAmount={votesAmount}
            initialVote={currentVote}
          />

          <Button
            onClick={() => {
              if (!session) {
                return push('/sign-in');
              }

              setIsReplying(true);
            }}
            variant="ghost"
            size="xs"
            aria-label="reply"
          >
            <MessageSquare className="mr-1.5 size-4" />
            Reply
          </Button>
        </div>

        {showPostLink && comment.Post && (
          <Link
            className={buttonVariants({
              variant: 'ghost',
              size: 'xs',
            })}
            href={`/r/${comment.Post.subreddit.name}/post/${comment.Post.id}#${comment.id}`}
          >
            To comment
            <ArrowBigRight className="ml-1 size-4" />
          </Link>
        )}

        {isReplying && (
          <div className="grid w-full gap-1.5">
            <Label>Your comment</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isCommentLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input.length) return;
                    commentFn({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComment;
