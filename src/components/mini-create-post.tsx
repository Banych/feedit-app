'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserAvatar from '@/components/user-avatar';
import { ImageIcon, Link2 } from 'lucide-react';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';
import { FC } from 'react';

type MiniCreatePostProps = {
  session: Session | null;
};

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex justify-between gap-6 px-6 py-4">
        {session?.user ? (
          <div className="relative">
            <UserAvatar
              user={{
                name: session?.user?.name || null,
                image: session?.user?.image || null,
              }}
            />
            <span className="absolute bottom-0 size-3 rounded-full bg-green-500 outline outline-2 outline-white ring-0" />
          </div>
        ) : null}
        <Input
          readOnly
          onClick={() => push(pathname + '/submit')}
          placeholder="Create a post"
        />

        <Button
          variant="ghost"
          onClick={() => push(pathname + '/submit')}
          className="hidden md:block"
        >
          <ImageIcon className="text-zinc-600" />
        </Button>

        <Button
          variant="ghost"
          onClick={() => push(pathname + '/submit')}
          className="hidden md:block"
        >
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </div>
  );
};

export default MiniCreatePost;
