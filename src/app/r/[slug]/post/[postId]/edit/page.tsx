import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FC } from 'react';

type EditPostPageProps = {
  params: Promise<{
    postId: string;
    slug: string;
  }>;
};

const EditPostPage: FC<EditPostPageProps> = async ({ params }) => {
  const { postId, slug } = await params;

  const session = await getAuthSession();

  if (!session) {
    return notFound();
  }

  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      subreddit: true,
    },
  });

  if (!post || post.authorId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Edit Post{' '}
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{slug}
          </p>
        </div>
      </div>
      <Editor
        subredditId={post.subredditId}
        content={post.content}
        title={post.title}
        postId={post.id}
      />
      <div className="flex w-full justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Update
        </Button>
      </div>
    </div>
  );
};

export default EditPostPage;
