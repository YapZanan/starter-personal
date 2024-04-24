import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Menu from "@/models/menuModel";
import {
	ServerMenuType,
	zMenuSchema,
	zMenuSchemaOnlyKode,
	zMenuSchemaWithoutKode,
} from "@/schema/menuSchema";

async function handleResponse(
	responseData: responseInterface,
	statusCode: number,
) {
	return NextResponse.json(responseData, { status: statusCode });
}

async function handleServerError() {
	const responseData: responseInterface = {
		success: false,
		error: [{ message: "Internal server error" }],
	};
	return handleResponse(responseData, 500);
}

export async function GET(req: NextRequest) {
	try {
		await connectMongoDB();
		const request = req.nextUrl.searchParams.get("menuMakanan");
		if (request) {
			const menu = await Menu.findOne({ kodeMakanan: request });
			if (!menu) {
				return handleResponse(
					{ success: false, error: [{ message: "Menu not found" }] },
					404,
				);
			}

			const response = zMenuSchema.safeParse(menu);
			if (!response.success) {
				return handleResponse(
					{ success: false, validationError: response.error },
					400,
				);
			}

			return handleResponse({ success: true, dataSets: [{ data: menu }] }, 200);
		} else {
			const menus = await Menu.find({});

			return handleResponse(
				{ success: true, dataSets: [{ totalData: menus.length, data: menus }] },
				200,
			);
		}
	} catch (error) {
		return handleServerError();
	}
}

export async function POST(req: NextRequest) {
	try {
		// console.log(req.body);
		const request = zMenuSchemaWithoutKode.safeParse(await req.json());
		if (!request.success) {
			return handleResponse(
				{ success: false, validationError: request.error },
				400,
			);
		}

		await connectMongoDB();

		const {
			fotoMenu,
			hargaMenu,
			jenisMenu,
			namaMenu,
			deskripsiMenu,
			tambahanMenu,
		} = request.data as ServerMenuType;

		const latestMenu = await Menu.findOne().sort({ createdAt: -1 }).exec();
		let numericPart = 1;
		if (latestMenu) {
			numericPart = parseInt(latestMenu.kodeMakanan.substring(2), 10) + 1;
		}
		const kodeMakanan = `${jenisMenu.substring(0, 2).toUpperCase()}${numericPart
			.toString()
			.padStart(5, "0")}`;

		const dateNow = new Date();
		const createdAt = dateNow;
		const updatedAt = dateNow;

		const menu = new Menu({
			fotoMenu,
			hargaMenu,
			jenisMenu,
			namaMenu,
			deskripsiMenu,
			tambahanMenu,
			kodeMakanan,
			createdAt,
			updatedAt,
		});

		const response = zMenuSchema.safeParse(menu);
		if (!response.success) {
			return handleResponse(
				{ success: false, validationError: response.error },
				400,
			);
		}

		await menu.save();
		return handleResponse(
			{
				success: true,
				message: "Menu Added Successfully",
				dataSets: [{ data: response.data }],
			},
			200,
		);
	} catch (error) {
		// return handleServerError();
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const request = zMenuSchema.safeParse(await req.json());
		if (!request.success) {
			return handleResponse(
				{ success: false, validationError: request.error },
				400,
			);
		}

		const { kodeMakanan, ...updatedMenu } = request.data as ServerMenuType;
		updatedMenu.updatedAt = new Date();
		await connectMongoDB();

		const menu = await Menu.findOneAndUpdate(
			{ kodeMakanan: kodeMakanan },
			updatedMenu,
		);
		if (!menu) {
			return handleResponse(
				{ success: false, error: [{ message: "Data Not Found" }] },
				404,
			);
		}

		return handleResponse(
			{
				success: true,
				message: "Data Updated Successfully",
				dataSets: [{ data: updatedMenu }],
			},
			200,
		);
	} catch (error) {
		return handleServerError();
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const request = zMenuSchemaOnlyKode.safeParse(await req.json());
		if (!request.success) {
			return handleResponse(
				{ success: false, validationError: request.error },
				400,
			);
		}
		const kodeMakanan = request.data.kodeMakanan;

		await connectMongoDB();
		try {
			const deletedMenu = await Menu.findOneAndDelete({
				kodeMakanan: kodeMakanan,
			});
			if (!deletedMenu) {
				return handleResponse({ success: false, message: "No Record" }, 404);
			}
			return handleResponse(
				{ success: true, message: "Menu deleted successfully" },
				200,
			);
		} catch (error) {
			return handleServerError();
		}
	} catch (error) {
		return handleServerError();
	}
}
