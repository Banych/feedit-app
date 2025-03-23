'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';

const ButtonBack = () => {
  const pathname = usePathname();
  const { back } = useRouter();

  if (pathname.includes('/r/') && !pathname.includes('/edit')) {
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
  }

  return (
    <Button
      variant="ghost"
      className={buttonVariants({ variant: 'ghost' })}
      onClick={() => back()}
    >
      <ChevronLeft className="size-6" />
      Back
    </Button>
  );
};

export default ButtonBack;
