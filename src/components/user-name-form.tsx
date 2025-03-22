'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { UserNamePayload, UserNameValidator } from '@/lib/validators/user-name';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

type UserNameFormProps = {
  user: Pick<User, 'username' | 'id'>;
};

const UserNameForm: FC<UserNameFormProps> = ({ user }) => {
  const { refresh } = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserNamePayload>({
    resolver: zodResolver(UserNameValidator),
    defaultValues: {
      name: user.username || '',
    },
  });

  const { mutate: update, isPending: isUpdateLoading } = useMutation({
    mutationFn: async ({ name }: UserNamePayload) => {
      const payload: UserNamePayload = { name };

      const { data } = await axios.patch(`/api/username`, payload);

      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: 'Username already taken',
            description: 'Please choose a different username.',
            variant: 'destructive',
          });
        }
      }

      toast({
        title: 'An error occurred',
        description: 'Could not update your username.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Username updated',
        description: 'Your username has been successfully updated.',
      });
      refresh();
    },
  });

  return (
    <form onSubmit={handleSubmit((e) => update(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you would like to use on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="pl-6 md:w-[400px]"
              size={32}
              {...register('name')}
            />
            {errors.name && (
              <p className="px-1 text-start text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isUpdateLoading} type="submit">
            Change name
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;
