import SignUp from '@/components/sign-up';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'self-start -mt-20'
          )}
        >
          <ChevronLeft className="mr-2 size-4" /> Home
        </Link>

        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;
