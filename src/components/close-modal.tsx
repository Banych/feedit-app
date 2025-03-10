'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CloseModal = () => {
  const { back } = useRouter();

  return (
    <Button
      aria-label="Close modal"
      variant="subtle"
      className="h-6 w-6 rounded-md p-0"
      onClick={back}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
