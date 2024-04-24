import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env/server.ts");

/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "via.placeholder.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "drive.google.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "wallpapers.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "image-0.uhdpaper.com",
				port: "",
			},
		],
	},
};
// module.exports = withPWA({
// 	// next.js config
// 	nextConfig,
// });
// // export default ;

// export default withPWAInit({
// 	...nextConfig,
// 	dest: "public",
// });

export default nextConfig;
