'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { SearchResults } from '@/types/search-bar';
import { useHotkeys } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Loader2, NotepadText, Search, Users } from 'lucide-react';
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
  // const commandRef = useClickAway<HTMLDivElement>(() => {
  //   setSearchQuery('');
  // });

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

  const subreddits = queryResults?.subreddits ?? [];
  const posts = queryResults?.posts ?? [];

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Search className="mr-2 size-5" />
        Search...
        <Badge variant="outline" className="ml-2">
          Ctrl+K
        </Badge>
      </Button>
      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        showCloseButton={false}
        dialogHeaderClassname="sr-only"
        dialogTitle="Search"
        dialogDescription="Search communities and posts"
        commandProps={{
          shouldFilter: false,
          loop: true,
        }}
      >
        <CommandInput
          className="border-none outline-none ring-0 focus:border-none focus:outline-none"
          placeholder="Search..."
          value={searchQuery}
          onValueChange={handleCommandInputChange}
          ref={commandInputRef}
        />
        <div className="pointer-events-none absolute right-2 top-2">
          <Badge variant="secondary">Esc</Badge>
        </div>
        <CommandList className="min-h-60 rounded-b-md bg-white shadow">
          {!searchQuery.length && (
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
              {!!subreddits.length && (
                <CommandGroup heading="Communities">
                  {subreddits
                    .filter((subreddit) => `/r/${subreddit.name}` !== pathname)
                    .map((subreddit) => (
                      <CommandItem
                        key={subreddit.id}
                        value={subreddit.name}
                        asChild
                        className="cursor-pointer"
                        onSelect={() => {
                          push(`/r/${subreddit.name}`);
                        }}
                      >
                        <Link
                          href={`/r/${subreddit.name}`}
                          onClick={(e) => e.preventDefault()}
                        >
                          <Users className="mr-2 size-4" />
                          {subreddit.name}
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
              {!!posts?.length && (
                <CommandGroup heading="Posts">
                  {posts
                    .filter(
                      (post) =>
                        `/r/${post.subreddit.name}/post/${post.id}` !== pathname
                    )
                    .map((post) => (
                      <CommandItem
                        key={post.id}
                        value={post.title}
                        asChild
                        className="cursor-pointer"
                        onSelect={() => {
                          push(`/r/${post.subreddit.name}/post/${post.id}`);
                        }}
                      >
                        <Link
                          href={`/r/${post.subreddit.name}/post/${post.id}`}
                          onClick={(e) => e.preventDefault()}
                        >
                          <NotepadText className="mr-2 size-4" />
                          {post.title}
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
