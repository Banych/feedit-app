import ButtonBack from '@/components/button-back';
import { FC, PropsWithChildren } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="max-w-7xl pb-6 sm:container">
      <ButtonBack />
      {children}
    </div>
  );
};

export default UserLayout;
