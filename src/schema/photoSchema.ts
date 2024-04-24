import { z } from "zod";
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];
const zPhotoMenu = z.object({
	imageMenu: z.any(),
});

export { zPhotoMenu };
export type photoMenuType = z.infer<typeof zPhotoMenu>;
