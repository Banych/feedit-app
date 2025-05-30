import { Icons } from '@/components/icons';
import MySocialLinks from '@/components/my-social-links';
import SearchBar from '@/components/search-bar';
import { buttonVariants } from '@/components/ui/button';
import UserAccountNav from '@/components/user-account-nav';
import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';

const NavBar = async () => {
  const session = await getAuthSession();

  return (
    <div className="sticky inset-x-0 top-0 z-10 h-fit border-b border-zinc-300 bg-zinc-100 py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="size-8 sm:size-6" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Feedit
          </p>
        </Link>

        <SearchBar />

        <div className="flex items-center gap-2 md:gap-6">
          <MySocialLinks />
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
