'use client';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useHotkeys } from '@mantine/hooks';
import { Prisma, Subreddit } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useClickAway } from '@uidotdev/usehooks';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Loader2, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { push, refresh } = useRouter();
  const pathname = usePathname();
  const commandInputRef = useRef<HTMLInputElement>(null);

  const commandRef = useClickAway<HTMLDivElement>(() => {
    setSearchQuery('');
  });

  useHotkeys([['mod+k', () => commandInputRef.current?.focus()]]);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ['search-query'],
    queryFn: async () => {
      if (!searchQuery) {
        return [];
      }

      const { data } = await axios.get(`/api/search?q=${searchQuery}`);

      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debouncedRequest = useCallback(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [pathname]);

  const handleCommandInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleCommandInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Command
      ref={commandRef}
      className="relative z-50 max-w-lg overflow-visible rounded-lg border"
    >
      <CommandInput
        className="border-none outline-none ring-0 focus:border-none focus:outline-none"
        placeholder="Search communities..."
        value={searchQuery}
        onValueChange={handleCommandInputChange}
        ref={commandInputRef}
        onFocus={handleCommandInputFocus}
        onBlur={handleCommandInputBlur}
      />
      <div
        className="absolute inset-y-0 right-3 flex items-center opacity-20"
        style={{ pointerEvents: 'none' }}
      >
        <Badge variant="outline">Ctrl+K</Badge>
      </div>
      <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow">
        {!searchQuery && isFocused && (
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
            {(queryResults?.length ?? 0) > 0 && (
              <CommandGroup heading="Communities">
                {queryResults?.map((subreddit) => (
                  <CommandItem
                    key={subreddit.id}
                    onSelect={(e) => {
                      push(`/r/${e}`);
                      refresh();
                    }}
                    value={subreddit.name}
                  >
                    <Users className="mr-2 size-4" />
                    <a href={`/r/${subreddit.name}`}>{subreddit.name}</a>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </Command>
  );
};

export default SearchBar;
