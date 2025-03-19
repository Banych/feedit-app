import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarProps } from '@radix-ui/react-avatar';
import { User } from 'next-auth';
import Image from 'next/image';
import { FC } from 'react';

type UserAvatarProps = AvatarProps & {
  user: Pick<User, 'name' | 'email' | 'image'>;
};

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image && user.name ? (
        <div className="relative aspect-square size-full">
          <Image
            fill
            src={user.image}
            alt={user.name}
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.defaultUser className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
