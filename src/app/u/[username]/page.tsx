import CommentsFeed from '@/components/comments-feed';
import PostFeed from '@/components/post-feed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAvatar from '@/components/user-avatar';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FC } from 'react';

type UserPageProps = {
  params: Promise<{ username: string }>;
};

const UserPage: FC<UserPageProps> = async ({ params }) => {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: {
      username,
    },
    include: {
      Post: {
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
        include: {
          comments: true,
          subreddit: true,
          author: true,
          votes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      createdSubreddits: true,
      Comment: {
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Post: {
            include: {
              subreddit: true,
            },
          },
          author: true,
          votes: {
            include: {
              user: true,
            },
          },
          replies: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <div className="flex flex-col-reverse items-center gap-2 md:flex-row md:justify-between md:gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-5xl font-bold">{user.username}</h2>
          <p className="text-2xl text-muted-foreground">{user.name}</p>
        </div>
        <UserAvatar
          className="size-24"
          user={{
            image: user.image,
            name: user.name,
          }}
        />
      </div>
      <hr className="my-6 h-px w-full" />
      <div className="hidden grid-cols-5 gap-8 md:grid">
        <div className="col-span-3 flex flex-col gap-6">
          <h3 className="text-2xl font-bold">Posts</h3>
          {!user.Post.length ? (
            <p className="text-xl text-muted-foreground">No posts yet</p>
          ) : (
            <PostFeed initialPosts={user.Post} userId={user.id} />
          )}
        </div>
        <div className="col-span-2 flex flex-col gap-6">
          <h3 className="text-2xl font-bold">Comments</h3>
          {!user.Comment.length ? (
            <p className="text-xl text-muted-foreground">No comments yet</p>
          ) : (
            <CommentsFeed initialComments={user.Comment} userId={user.id} />
          )}
        </div>
      </div>
      <Tabs className="md:hidden" defaultValue="posts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {!user.Post.length ? (
            <p className="text-xl text-muted-foreground">No posts yet</p>
          ) : (
            <PostFeed initialPosts={user.Post} userId={user.id} />
          )}
        </TabsContent>
        <TabsContent value="comments">
          {!user.Comment.length ? (
            <p className="text-xl text-muted-foreground">No comments yet</p>
          ) : (
            <CommentsFeed initialComments={user.Comment} userId={user.id} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPage;
