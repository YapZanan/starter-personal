import { env } from "@/env/server";
import { randomBytes, randomUUID } from "crypto";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// if (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET) {
// 	throw new Error("Google client ID or client secret is not set");
// }

const googleClientId = env.googleClientId;
const googleClientSecret = env.googleClientSecret;
export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider(<AuthInterface>{
			clientId: googleClientId,
			clientSecret: googleClientSecret,
			authorization: {
				params: {
					prompt: "consent",
					response_type: "code",
					scope: "openid email profile https://www.googleapis.com/auth/drive",
				},
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
		generateSessionToken: () => {
			return randomUUID?.() ?? randomBytes(32).toString("hex");
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, account, profile }) {
			// Persist the OAuth access_token and or the user id to the token right after signin
			if (account) {
				token.access_token = account.access_token;
			}
			return token;
		},
	},
};
