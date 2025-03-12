import CustomFeed from '@/components/custom-feed';
import GeneralFeed from '@/components/general-feed';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {/* @ts-expect-error server component async */}
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* subreddit info */}
        <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="size-4" />
              Home
            </p>
          </div>
          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Feedit home page. Come here to check in with your
                favorite communities.
              </p>
            </div>
            <Link
              href="/r/create"
              className={buttonVariants({ className: 'w-full mt-4 mb-6' })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
