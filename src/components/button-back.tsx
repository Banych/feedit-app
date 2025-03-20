'use client';

import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ButtonBack = () => {
  const pathname = usePathname();

  const pathParts = pathname?.split('/') || [];
  const subreddit = pathParts[2];
  const post = pathParts[4];

  return (
    <Link
      className={buttonVariants({ variant: 'ghost' })}
      href={post ? `/r/${subreddit}` : '/'}
    >
      <ChevronLeft className="size-6" />
      {subreddit ? (post ? 'Back to community' : 'Back to feed') : 'Back'}
    </Link>
  );
};

export default ButtonBack;
