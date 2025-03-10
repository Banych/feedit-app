'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FC, HTMLAttributes, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
