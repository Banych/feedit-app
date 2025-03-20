import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';

const ButtonBack = async () => {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname');

  const pathParts = pathname?.split('/') || [];
  const subreddit = pathParts[2];
  const post = pathParts[4];

  return (
    <Link
      className={buttonVariants({ variant: 'ghost' })}
      href={post ? `/r/${subreddit}` : '/'}
    >
      <ChevronLeft className="size-6" />
      {subreddit ? (post ? 'Back to post' : 'Back to community') : 'Back'}
    </Link>
  );
};

export default ButtonBack;
