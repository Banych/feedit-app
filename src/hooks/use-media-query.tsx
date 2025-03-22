import { useMediaQuery } from '@mantine/hooks';

const useLaptopMediaQuery = () => useMediaQuery('(max-width: 1024px)');

const useTabletMediaQuery = () => useMediaQuery('(max-width: 768px)');

const useMobileMediaQuery = () => useMediaQuery('(max-width: 480px)');

export { useLaptopMediaQuery, useMobileMediaQuery, useTabletMediaQuery };
