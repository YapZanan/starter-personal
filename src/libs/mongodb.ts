import mongoose from "mongoose";
import { env } from "../env/server";

const connectMongoDB = async () => {
	try {
		const uri = env.MONGODB_URI;
		if (!uri) {
			throw new Error("MONGODB_URI is not defined in environment variables");
		}
		await mongoose.connect(uri);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
};

export default connectMongoDB;
