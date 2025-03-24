import { Icons } from '@/components/icons';

const MySocialLinks = () => {
  return (
    <div className="flex items-center gap-2">
      <a
        href="https://github.com/Banych/feedit-app"
        target="_blank"
        rel="noreferrer"
      >
        <Icons.github className="size-4 text-gray-800 transition-colors hover:text-gray-600" />
      </a>
      <a
        href="https://www.linkedin.com/in/vladislav-banykin/"
        target="_blank"
        rel="noreferrer"
      >
        <Icons.linkedIn className="size-4 text-blue-800 transition-colors hover:text-blue-600" />
      </a>
    </div>
  );
};

export default MySocialLinks;
