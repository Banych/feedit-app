import type { OutputData } from '@editorjs/editorjs';

export const isOutputData = (value: unknown): value is OutputData => {
  if (typeof value !== 'object' || value === null) return false;
  if (!('blocks' in value)) return false;
  if (!Array.isArray(value.blocks)) return false;
  if (
    !value.blocks.every((block) => typeof block === 'object' && block !== null)
  )
    return false;
  return true;
};
