import { Skeleton } from '@/components/ui/skeleton';
import { FC } from 'react';

type EditorOutputSkeletonProps = {
  isSmall?: boolean;
};

const EditorOutputSkeleton: FC<EditorOutputSkeletonProps> = ({ isSmall }) => {
  // here should be skeleton placeholder for the editor output where could be text, images, etc.
  // need to create a skeleton for the editor output component to show a loading state with a skeleton placeholder for block replacing image at te top of the post
  // and a skeleton placeholder for the text content of the post (it might be multiline text so several lines of skeleton placeholders should be shown)

  if (isSmall) {
    return (
      <div className="grid grid-cols-2 grid-rows-4 gap-4 sm:grid-cols-3">
        <Skeleton className="row-span-3 h-20" />
        <Skeleton className="h-4 sm:col-span-2" />
        <Skeleton className="h-4 sm:col-span-2" />
        <Skeleton className="h-4 sm:col-span-2" />
        <Skeleton className="h-4 sm:col-span-3" />
        <Skeleton className="h-4 sm:col-span-3" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-60 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
};

export default EditorOutputSkeleton;
