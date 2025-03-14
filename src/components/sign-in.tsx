import { Icons } from '@/components/icons';
import UserAuthForm from '@/components/user-auth-form';
import Link from 'next/link';

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto size-6" />
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are setting up a Feedit account and agree to our
          User Agreement and Privacy Policy.
        </p>

        {/* Sign in form */}
        <UserAuthForm className="" />

        <p className="px-8 text-center text-sm text-zinc-700">
          New to Feedit?{' '}
          <Link
            href="/sign-up"
            className="text-sm underline underline-offset-4 hover:text-zinc-800"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
