import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		MONGODB_URI: z.string().min(1),
		googleClientId: z.string().min(1),
		googleClientSecret: z.string().min(1),
		googleAPIkey: z.string().min(1),
		NEXTAUTH_SECRET: z.string().min(1),
		NEXT_SERVER_NEXTAUTH_URL: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_SERVER_NEXTAUTH_URL: z.string().min(1),
		NEXT_PUBLIC_NEXTAUTH_URL: z.string().min(1),
		NEXT_PUBLIC_aaaa: z.string().min(1),
		NEXT_PUBLIC_bbb: z.string().min(1),
		NEXT_PUBLIC_cccc: z.string().min(1),
		NEXT_PUBLIC_ddd: z.string().min(1),
		NEXT_PUBLIC_dddasdasd: z.string().min(1),
		NEXT_PUBLIC_dddadasdasdasdasdd: z.string().min(1),
	},
	runtimeEnv: {
		MONGODB_URI: process.env.MONGODB_URI,
		googleClientId: process.env.googleClientId,
		googleClientSecret: process.env.googleClientSecret,
		googleAPIkey: process.env.googleAPIkey,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXT_PUBLIC_SERVER_NEXTAUTH_URL: process.env.NEXT_PUBLIC_SERVER_NEXTAUTH_URL,
		NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_SERVER_NEXTAUTH_URL,
		NEXT_SERVER_NEXTAUTH_URL: process.env.NEXT_PUBLIC_SERVER_NEXTAUTH_URL,
		NEXT_PUBLIC_aaaa: process.env.NEXT_PUBLIC_aaaa,
		NEXT_PUBLIC_bbb: process.env.NEXT_PUBLIC_bbb,
		NEXT_PUBLIC_cccc: process.env.NEXT_PUBLIC_cccc,
		NEXT_PUBLIC_ddd: process.env.NEXT_PUBLIC_ddd,
		NEXT_PUBLIC_dddasdasd: process.env.NEXT_PUBLIC_dddasdasd,
		NEXT_PUBLIC_dddadasdasdasdasdd: process.env.NEXT_PUBLIC_dddadasdasdasdasdd,
	}
});
