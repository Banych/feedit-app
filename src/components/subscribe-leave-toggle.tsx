'use client';

import { Button } from '@/components/ui/button';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ClassValue } from 'clsx';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';
import { FC, startTransition } from 'react';

type SubscribeLeaveToggleProps = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
  className?: ClassValue;
};

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
  className,
}) => {
  const { loginToast } = useCustomToast();
  const { refresh } = useRouter();

  const { mutate: subscribe, isPending: isSubscriptionLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/subscribe', payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was an error subscribing to the subreddit',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      startTransition(() => {
        refresh();
      });

      return toast({
        title: 'Subscribed to subreddit',
        description: `You will now see posts from r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isPending: isUnsubscribeLoading } = useMutation({
    mutationFn: async () => {
      await axios.post('/api/subreddit/unsubscribe', {
        subredditId,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was an error unsubscribing from the subreddit',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      startTransition(() => {
        refresh();
      });

      return toast({
        title: 'Unsubscribed from subreddit',
        description: `You will no longer see posts from r/${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className={cn('mb-4 mt-1 w-full', className)}
      isLoading={isUnsubscribeLoading}
      onClick={() => unsubscribe()}
    >
      Leave Community
    </Button>
  ) : (
    <Button
      className={cn('mb-4 mt-1 w-full', className)}
      isLoading={isSubscriptionLoading}
      onClick={() => subscribe()}
    >
      Join to Post
    </Button>
  );
};

export default SubscribeLeaveToggle;
