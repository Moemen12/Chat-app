import { UTApi } from "uploadthing/server";

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error

    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const deleteFileFromUploadthing = async (
  fileUrl: string
): Promise<boolean> => {
  try {
    await new UTApi().deleteFiles(fileUrl);
    return true;
  } catch (error) {
    return false;
  }
};
