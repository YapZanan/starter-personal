import { z } from "zod";

const zMenuSchema = z.object({
	kodeMakanan: z
		.string({
			required_error: "kodeMakanan is required",
			invalid_type_error: "kodeMakanan must be a string",
			description: "kodeMakan",
		})
		.trim()
		.min(1),
	namaMenu: z
		.string({
			required_error: "namaMenu is required",
			invalid_type_error: "namaMenu must be a string",
		})
		.trim()
		.min(1),
	deskripsiMenu: z
		.string({
			invalid_type_error: "deskripsiMenu must be a string",
		})
		.trim()
		.optional(),
	jenisMenu: z.enum(["Makanan", "Minuman", "Snack", "Beer"], {
		invalid_type_error:
			"jenisMenu must be one of: Makanan, Minuman, Snack, Beer",
	}),
	fotoMenu: z
		.string()
		.url({
			message: "fotoMenu must be a valid URL",
		})
		.trim()
		.min(1),
	hargaMenu: z.number().int().min(0, {
		message: "hargaMenu must be a positive integer",
	}),
	tambahanMenu: z
		.array(
			z.object({
				jenisTambahan: z.string().trim().min(1, {
					message: "jenisTambahan must be provided",
				}),
				hargaTambahan: z.number().int().min(0, {
					message: "hargaTambahan must be a positive integer",
				}),
			}),
			{
				invalid_type_error: "tambahanMenu must be an array of objects",
			},
		)
		.optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export { zMenuSchema };
export type ServerMenuType = z.infer<typeof zMenuSchema>;

export const zMenuSchemaWithoutKode = zMenuSchema.omit({ kodeMakanan: true });
export type ClientMenuType = z.infer<typeof zMenuSchemaWithoutKode>;

export const zMenuSchemaOnlyKode = zMenuSchema.pick({
	kodeMakanan: true,
});
export type KodeMenuType = z.infer<typeof zMenuSchemaOnlyKode>;
