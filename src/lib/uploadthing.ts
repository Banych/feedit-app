import { OurFileRouter } from '@/app/api/uploadthing/core';
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';

export const uploadButton = generateUploadButton<OurFileRouter>();
export const uploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { uploadFiles } = generateReactHelpers<OurFileRouter>();
