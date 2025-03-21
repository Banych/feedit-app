'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';

type UserAccountNavProps = {
  user: Pick<User, 'name' | 'email' | 'image'> & {
    username?: string | null;
  };
};

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
          className="size-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] bg-white" align="end">
        <DropdownMenuItem className="cursor-pointer items-start" asChild>
          <Link
            href={`/u/${user.username}`}
            className="flex flex-col gap-0 leading-none"
          >
            {user.name && (
              <span className="text-lg font-medium">{user.name}</span>
            )}
            {user.email && (
              <span className="truncate text-sm text-zinc-700">
                {user.email}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/r/create">Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: `${window.location.origin}/sign-in` });
          }}
          className="cursor-pointer"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
