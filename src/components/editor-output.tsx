'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC } from 'react';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
);

type EditorOutputProps = {
  content: unknown;
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

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    // @ts-expect-error Output is not a valid JSX element
    <Output
      className="text-sm"
      data={content}
      style={style}
      renderers={renderers}
    />
  );
};

function CustomImageRenderer({ data }: { data: { file: { url: string } } }) {
  const src = data.file.url;
  return (
    <div className="relative min-h-60 w-full">
      <Image
        alt="image"
        className="object-contain"
        src={src}
        fill
        priority={true}
      />
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
