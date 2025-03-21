'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FC, HTMLAttributes, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to login',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const loginWithGithub = async () => {
    setIsGithubLoading(true);

    try {
      await signIn('github');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to login',
        description: 'Failed to sign in with Github',
        variant: 'destructive',
      });
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div
      className={cn('flex flex-col items-center gap-4', className)}
      {...props}
    >
      <Button
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        isLoading={isGoogleLoading}
      >
        {isGoogleLoading ? null : <Icons.google className="mr-2 size-4" />}
        Google
      </Button>
      <Button
        size="sm"
        className="w-full"
        onClick={loginWithGithub}
        isLoading={isGithubLoading}
      >
        {isGithubLoading ? null : (
          <Icons.github className="mr-2 size-4 text-white dark:text-gray-400" />
        )}
        Github
      </Button>
    </div>
  );
};

export default UserAuthForm;
