'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { CreateSubredditPayload } from '@/lib/validators/subreddit';
import { useToast } from '@/hooks/use-toast';
import { useCustomToast } from '@/hooks/use-custom-toast';

const CratePage = () => {
  const [input, setInput] = useState<string>('');
  const { toast } = useToast();
  const { loginToast } = useCustomToast();

  const { back, push } = useRouter();

  const { mutate: createCommunity, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post('/api/subreddit', payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: 'Subreddit already exists',
            description: 'Please choose a different subreddit name',
            variant: 'destructive',
          });
        }

        if (error.response?.status === 422) {
          return toast({
            title: 'Invalid subreddit name',
            description: 'Please choose a different subreddit name',
            variant: 'destructive',
          });
        }

        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: 'An error occurred',
        description: 'Could not create subreddit.',
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      push(`/r/${data}`);
    },
  });

  return (
    <div className="flex max-w-3xl flex-col items-center">
      <div className="relative h-fit w-full space-y-3 rounded-lg bg-white p-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>
        <hr className="h-px bg-zinc-500" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-sm">
            Community names including capitalization cannot be changed.
          </p>

          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              r/
            </p>
            <Input
              className="pl-6"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={back}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CratePage;
