import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import fs from "fs";
import path from "path";
import { ServerTrackingType, zTrackingSchema } from "@/schema/trackingSchema";
import Tracking from "@/models/trackingModel";

async function handleServerError() {
	return NextResponse.json(
		{ success: false, error: [{ message: "Internal server error" }] },
		{ status: 500 },
	);
}

async function handleResponse(
	responseData: responseInterface,
	statusCode: number,
) {
	return NextResponse.json(responseData, { status: statusCode });
}

export async function GET(req: NextRequest) {
	try {
		await connectMongoDB();

		const emailPenerima = req.nextUrl.searchParams.get("email");
		const kodeID = req.nextUrl.searchParams.get("messageId");

		console.log(emailPenerima);
		const dateNow = new Date();
		const createdAt = dateNow;
		const updatedAt = dateNow;

		const tracking = new Tracking({
			kodeID,
			emailPenerima,
			createdAt,
			updatedAt,
		});

		await tracking.save();

		console.log("sdada");
		const filePath = path.resolve(".", "public/test.gif");
		const imageBuffer = fs.readFileSync(filePath);

		console.log(filePath);

		const response = new NextResponse(imageBuffer);
		response.headers.set("content-type", "image/gif");

		return response;
	} catch (error) {
		return handleServerError();
	}
}
