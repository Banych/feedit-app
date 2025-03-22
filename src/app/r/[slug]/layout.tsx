import ButtonBack from '@/components/button-back';
import SubscribeLeaveToggle from '@/components/subscribe-leave-toggle';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';

const CommunityLayout = async (
  props: PropsWithChildren<{ params: Promise<{ slug: string }> }>
) => {
  const params = await props.params;

  const { slug } = params;

  const { children } = props;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) {
    return notFound();
  }

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="max-w-7xl sm:container">
      <div>
        <div className="flex items-center justify-between">
          <ButtonBack />

          {subreddit.creatorId !== session?.user?.id ? (
            <SubscribeLeaveToggle
              subredditId={subreddit.id}
              subredditName={subreddit.name}
              isSubscribed={isSubscribed}
            />
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-y-4 py-2 md:grid-cols-3 md:gap-x-4 md:py-6">
          <div className="col-span-2 flex flex-col gap-y-4 md:gap-y-6">
            {children}
          </div>

          <div className="order-first hidden h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last md:block">
            <div className="px-6 py-4">
              <p className="py-3 font-semibold">About r/{subreddit.name}</p>
            </div>
            <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, 'MMMM dd, yyyy')}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Mebers</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You created this community</p>
                </div>
              ) : null}
              {subreddit.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}
              {isSubscribed ? (
                <Link
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full mb-6',
                  })}
                  href={`/r/${slug}/submit`}
                >
                  Create Post
                </Link>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
