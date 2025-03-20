'use client';

import { toast } from '@/hooks/use-toast';
import { uploadFiles } from '@/lib/uploadthing';
import {
  PostCreationRequestPayload,
  PostValidator,
} from '@/lib/validators/post';
import type EditorJS from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname } from 'next/navigation';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextAreaAutosize from 'react-textarea-autosize';

type EditorProps = {
  subredditId: string;
};

const Editor: FC<EditorProps> = ({ subredditId }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEditorMounted, setIsEditorMounted] = useState(false);

  const pathname = usePathname();
  const { push, refresh } = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PostCreationRequestPayload>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  });

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequestPayload) => {
      const payload: PostCreationRequestPayload = {
        title,
        content,
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/post/create', payload);

      return data;
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Your post was not published, please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      const newPathname = pathname.replace(/\/submit$/, '');
      push(newPathname);

      refresh();

      return toast({
        title: 'Post published',
        description: 'Your post was published successfully.',
      });
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const ImageTool = (await import('@editorjs/image')).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        onReady: () => {
          editorRef.current = editor;
        },
        placeholder: 'Type here to create a post...',
        inlineToolbar: true,
        data: {
          blocks: [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles(
                    (routeEndpoint) => routeEndpoint.imageUploader,
                    { files: [file] }
                  );

                  return {
                    success: 1,
                    file: {
                      url: res.ufsUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          table: Table,
          embed: Embed,
          inlineCode: InlineCode,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsEditorMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isEditorMounted) {
      init();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = null;
      };
    }
  }, [isEditorMounted, initializeEditor]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: 'Something went wrong',
          description: (value as { message: string }).message,
          variant: 'destructive',
        });
      }
    }
  }, [errors]);

  const onSubmit = async (data: PostCreationRequestPayload) => {
    const blocks = await editorRef.current?.save();

    const payload: PostCreationRequestPayload = {
      title: data.title,
      content: blocks,
      subredditId,
    };

    createPost(payload);
  };

  if (!isEditorMounted) {
    return null;
  }

  const { ref: titleRef, ...titleProps } = register('title');

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextAreaAutosize
            {...titleProps}
            ref={(e) => {
              titleRef(e);
              _titleRef.current = e;
            }}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />

          <div id="editorjs" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
