import CommentsSection from '@/components/comments-section';
import EditorOutput from '@/components/editor-output';
import PostVoteServer from '@/components/post-vote/post-vote-server';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/types/redis';
import { Post, User, Vote } from '@prisma/client';
import { compareAsc } from 'date-fns';
import {
  ArrowBigDown,
  ArrowBigUp,
  EllipsisVertical,
  Loader2,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type PostPageProps = {
  params: Promise<{
    postId: string;
    slug: string;
  }>;
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const PostPage = async (props: PostPageProps) => {
  const session = await getAuthSession();

  const params = await props.params;
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post:
    | (Post & {
        votes: Vote[];
        author: User;
      })
    | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) {
    return notFound();
  }

  const isAuthor = post?.authorId === session?.user.id;

  return (
    <div>
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findFirst({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="w-full flex-1 rounded-sm bg-white p-4 sm:w-0">
          <div className="flex items-start gap-4">
            <div className="flex grow flex-col items-start">
              <p className="mt-1 flex max-h-40 flex-wrap items-center gap-1 text-xs text-gray-500">
                Posted by{' '}
                <Link
                  href={`/u/${post?.author.username ?? cachedPost.authorUsername}`}
                  className="text-zinc-900 underline underline-offset-2"
                >
                  u/{post?.author.username ?? cachedPost.authorUsername}
                </Link>{' '}
                {formatTimeToNow(
                  new Date(post?.createdAt ?? cachedPost.createdAt)
                )}
                {post?.updatedAt &&
                  compareAsc(post.updatedAt, post.createdAt) !== 0 &&
                  ` (edited ${formatTimeToNow(new Date(post.updatedAt))})`}
              </p>
              <h1 className="py-2 text-xl font-semibold leading-6 text-gray-900">
                {post?.title ?? cachedPost.title}
              </h1>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="shrink-0">
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical className="size-5 text-zinc-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href={`/r/${params.slug}/post/${params.postId}/edit`}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={<Loader2 className="size-5 animate-spin text-zinc-500" />}
          >
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex w-20 flex-col items-center pr-6">
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className="size-5 text-zinc-700" />
      </div>

      <div className="py-2 text-center text-sm font-medium text-zinc-900">
        <Loader2 className="size-3 animate-spin" />
      </div>

      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className="size-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default PostPage;
