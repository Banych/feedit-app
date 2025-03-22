'use client';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SearchResults } from '@/types/search-bar';
import { useHotkeys } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useClickAway } from '@uidotdev/usehooks';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Loader2, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';
import { useCallback, useEffect, useRef, useState } from 'react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { push, refresh } = useRouter();
  const pathname = usePathname();
  const commandInputRef = useRef<HTMLInputElement>(null);
  const commandRef = useClickAway<HTMLDivElement>(() => {
    setSearchQuery('');
  });

  useHotkeys([
    [
      'mod+k',
      () => {
        setIsOpen(true);
        commandInputRef.current?.focus();
      },
    ],
  ]);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ['search-query'],
    queryFn: async () => {
      if (!searchQuery) {
        return {
          subreddits: [],
          posts: [],
        };
      }

      const { data } = await axios.get<SearchResults>(
        `/api/search?q=${searchQuery}`
      );

      return data;
    },
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debouncedRequest = useCallback(() => {
    request();
  }, []);

  const handleCommandInputChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      debouncedRequest();
    },
    [debouncedRequest]
  );

  useEffect(() => {
    setSearchQuery('');
    setIsOpen(false);
  }, [pathname]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className={buttonVariants({ variant: 'outline' })}>
          <Search className="mr-2 size-5" />
          Search Communities...
          <Badge variant="outline" className="ml-2">
            Ctrl+K
          </Badge>
        </div>
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="border-0 p-0">
        <DialogHeader className="sr-only h-0">
          <DialogTitle>Search Communities</DialogTitle>
        </DialogHeader>

        <Command
          ref={commandRef}
          className="relative max-w-lg overflow-visible rounded-lg border"
        >
          <CommandInput
            className="border-none outline-none ring-0 focus:border-none focus:outline-none"
            placeholder="Search communities..."
            value={searchQuery}
            onValueChange={handleCommandInputChange}
            ref={commandInputRef}
          />

          <div className="pointer-events-none absolute right-2 top-2">
            <Badge variant="secondary">Esc</Badge>
          </div>

          <CommandList className="min-h-60 rounded-b-md bg-white shadow">
            {!searchQuery && (
              <CommandEmpty>
                <div className="flex items-center justify-center text-zinc-500">
                  Please start typing to search.
                </div>
              </CommandEmpty>
            )}

            {searchQuery?.length > 0 && (
              <>
                <CommandEmpty>
                  <div className="flex items-center justify-center text-zinc-500">
                    {isFetched && !isFetching && 'No results found.'}

                    {isFetching && (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />{' '}
                        Searching...
                      </>
                    )}
                  </div>
                </CommandEmpty>

                {!!queryResults?.subreddits?.length && (
                  <CommandGroup heading="Communities">
                    {queryResults.subreddits.map((subreddit) => (
                      <CommandItem
                        key={subreddit.id}
                        onSelect={(e) => {
                          push(`/r/${e}`);

                          refresh();

                          setIsOpen(false);
                        }}
                        value={subreddit.name}
                      >
                        <Users className="mr-2 size-4" />

                        <Link href={`/r/${subreddit.name}`}>
                          {subreddit.name}
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {!!queryResults?.posts?.length && (
                  <CommandGroup heading="Posts">
                    {queryResults.posts.map((post) => (
                      <CommandItem key={post.id} value={post.title}>
                        <Link
                          href={`/r/${post.subreddit.name}/post/${post.id}`}
                        >
                          {post.title}
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
