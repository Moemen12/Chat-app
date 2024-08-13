import { OurFileRouter } from "@/app/api/(webhooks)/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
