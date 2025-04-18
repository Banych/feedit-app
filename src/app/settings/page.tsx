import UserNameForm from '@/components/user-name-form';
import { authOptions, getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
  keywords: 'settings, account, profile',
};

const SettingsPage = async () => {
  const session = await getAuthSession();

  if (!session) {
    redirect(authOptions.pages?.signIn || '/sign-in');
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid items-start gap-8">
        <h1 className="text-3xl font-bold md:text-4xl"></h1>
      </div>
      <div className="grid gap-10">
        <UserNameForm
          user={{
            id: session.user.id,
            username: session.user.username || '',
          }}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
