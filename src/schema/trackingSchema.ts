import { z } from "zod";

const zTrackingSchema = z.object({
	kodeID: z
		.string({
			required_error: "kodeID is required",
			invalid_type_error: "kodeID must be a string",
			description: "kodeID",
		})
		.trim()
		.min(1),
	emailPenerima: z
		.string({
			required_error: "emailPenerima is required",
			invalid_type_error: "emailPenerima must be a string",
		})
		.trim()
		.min(1)
		.optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export { zTrackingSchema };
export type ServerTrackingType = z.infer<typeof zTrackingSchema>;

export const zTrackingSchemaWithoutKode = zTrackingSchema.omit({
	kodeID: true,
});
export type ClientMenuType = z.infer<typeof zTrackingSchemaWithoutKode>;

export const zTrackingSchemaOnlyKode = zTrackingSchema.pick({
	kodeID: true,
});
export type KodeTrackingType = z.infer<typeof zTrackingSchemaOnlyKode>;
