'use client';

import EditorOutputSkeleton from '@/components/editor-output-skeleton';
import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC } from 'react';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false, loading: () => <EditorOutputSkeleton /> }
);

const OutputSmall = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false, loading: () => <EditorOutputSkeleton isSmall /> }
);

type EditorOutputProps = {
  content: unknown;
  isSmall?: boolean;
  className?: ClassValue;
};

const style = {
  // eslint-disable-next-line css/no-unknown-property
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({
  content,
  isSmall,
  className,
}) => {
  const Component = isSmall ? OutputSmall : Output;

  return (
    <Component
      className={cn('text-sm', className)}
      data={content}
      style={style}
      renderers={renderers}
    />
  );
};

function CustomImageRenderer({
  data,
}: {
  data: {
    file: { url: string };
    caption?: string;
    stretched?: boolean;
    withBorder?: boolean;
    withBackground?: boolean;
  };
}) {
  const {
    file: { url },
    caption,
    stretched,
    withBorder,
    withBackground,
  } = data;

  return (
    <div
      className={cn(
        'relative w-full min-h-40',
        stretched ? 'w-full' : '',
        withBorder ? 'border border-gray-300' : '',
        withBackground ? 'bg-gray-100 p-4' : ''
      )}
    >
      <Image
        alt={caption || 'image'}
        className="object-contain"
        src={url}
        fill
        priority={false}
        sizes="(max-width: 640px) 640px, 100vw"
        quality={100}
        placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="
      />
      {caption && (
        <p className="mt-2 text-center text-sm text-gray-500">{caption}</p>
      )}
    </div>
  );
}

function CustomCodeRenderer({ data }: { data: { code: string } }) {
  return (
    <pre className="rounded-md bg-gray-800 p-4 ">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}

export default EditorOutput;
