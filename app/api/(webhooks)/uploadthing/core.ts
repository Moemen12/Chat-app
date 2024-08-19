import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  updateProfile: f({
    image: {
      maxFileSize: "2MB",
      minFileCount: 1,
    },
  })
    .middleware(async ({ req, files }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Custom validation for JPEG and PNG
      const file = files[0]; // Access the first file in the array
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        throw new UploadThingError("Only JPEG and PNG images are allowed");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  sendChatImage: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(async ({ req, files }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Custom validation for JPEG and PNG
      const file = files[0]; // Access the first file in the array
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        throw new UploadThingError("Only JPEG and PNG images are allowed");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  updateImageGroup: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "2MB",
    },
  })
    .middleware(async ({ req, files }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Custom validation for JPEG and PNG
      const file = files[0]; // Access the first file in the array
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        throw new UploadThingError("Only JPEG and PNG images are allowed");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
