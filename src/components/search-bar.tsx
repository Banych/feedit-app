'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Prisma, Subreddit } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { push, refresh } = useRouter();

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
  }, []);

  return (
    <Command className="relative z-50 max-w-lg overflow-visible rounded-lg border">
      <CommandInput
        className="border-none outline-none ring-0 focus:border-none focus:outline-none"
        placeholder="Search communities..."
        value={searchQuery}
        onValueChange={(text) => {
          setSearchQuery(text);
          debouncedRequest();
        }}
      />
      {searchQuery.length > 0 && (
        <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow">
          {isFetched && <CommandEmpty>No results found</CommandEmpty>}
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
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
