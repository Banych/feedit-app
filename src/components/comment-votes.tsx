'use client';

import { Button } from '@/components/ui/button';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CommentVoteRequestPayload } from '@/lib/validators/vote';
import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

type CommentVotesProps = {
  commentId: string;
  initialVotesAmount: number;
  initialVote?: VoteType | null;
};

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmount,
  initialVote,
}) => {
  const [votesAmount, setVotesAmount] = useState(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);
  const [lastClickedVote, setLastClickedVote] = useState<VoteType | null>(null);

  const { loginToast } = useCustomToast();

  const { mutate: vote, isPending: isVoteLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequestPayload = {
        commentId,
        voteType,
      };

      await axios.patch('/api/subreddit/post/comment/vote', payload);
    },
    onError: (error, voteType) => {
      if (voteType === 'UP') {
        setVotesAmount((prev) => prev - 1);
      } else {
        setVotesAmount((prev) => prev + 1);
      }

      //reset current vote
      setCurrentVote(prevVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Failed to vote',
        variant: 'destructive',
      });
    },
    onMutate: (voteType) => {
      setLastClickedVote(voteType);

      if (currentVote === voteType) {
        setCurrentVote(undefined);
        if (voteType === 'UP') {
          setVotesAmount((prev) => prev - 1);
        } else if (voteType === 'DOWN') {
          setVotesAmount((prev) => prev + 1);
        }
      } else {
        setCurrentVote(voteType);

        if (voteType === 'UP') {
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
        } else if (voteType === 'DOWN') {
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
    onSettled: () => {
      setLastClickedVote(null);
    },
  });

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  return (
    <div className="flex gap-1">
      <Button
        onClick={() => vote('UP')}
        size="icon"
        variant="ghost"
        aria-label="upvote"
        isLoading={isVoteLoading && lastClickedVote === 'UP'}
        disabled={isVoteLoading}
        className="size-9"
      >
        <ArrowBigUp
          className={cn('size-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
      </Button>
      <p className="py-2 text-center text-sm font-medium text-zinc-900">
        {votesAmount}
      </p>
      <Button
        onClick={() => vote('DOWN')}
        size="icon"
        variant="ghost"
        aria-label="downvote"
        isLoading={isVoteLoading && lastClickedVote === 'DOWN'}
        disabled={isVoteLoading}
        className="size-9"
      >
        <ArrowBigDown
          className={cn('size-5  text-zinc-700', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
