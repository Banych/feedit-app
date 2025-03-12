'use client';

import CommentVotes from '@/components/comment-votes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/user-avatar';
import { toast } from '@/hooks/use-toast';
import { formatTimeToNow } from '@/lib/utils';
import { PostCommentPayload } from '@/lib/validators/comment';
import { Comment, CommentVote, User, VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FC, useRef, useState } from 'react';

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

type PostCommentProps = {
  comment: ExtendedComment;
  votesAmount: number;
  currentVote: VoteType | null;
  postId: string;
};

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmount,
  currentVote,
  postId,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);

  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState('');

  const { push, refresh } = useRouter();
  const { data: session } = useSession();

  const { mutate: commentFn, isLoading: isCommentLoading } = useMutation({
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

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="size-6"
        />
        <div className="ml-2 flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-sm text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-900">{comment.text}</p>
      <div className="flex flex-wrap items-center gap-2">
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
