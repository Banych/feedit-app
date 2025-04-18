'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
// @ts-expect-error - No types available
import { useRouter } from 'nextjs-toploader/app';

const CloseModal = () => {
  const { back } = useRouter();

  return (
    <Button
      aria-label="Close modal"
      variant="secondary"
      className="size-6 rounded-md p-0"
      onClick={back}
    >
      <X className="size-4" />
    </Button>
  );
};

export default CloseModal;
