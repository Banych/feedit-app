export const INFINITE_SCROLLING_PAGINATION_RESULTS = 10;

export const siteConfig = {
  title: 'Feedit',
  description:
    'A side project to build a Reddit clone with Next.js and TypeScript.',
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://app-feedit.vercel.app',
};
