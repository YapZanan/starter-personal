import mongoose from "mongoose";
import { z } from "zod";
import { zodSchema } from "@zodyac/zod-mongoose";
import { zMenuSchema } from "@/schema/menuSchema";

const menuSchema = zodSchema(zMenuSchema);

menuSchema.pre("save", async function (next) {
	next();
});

menuSchema.index({ namaMenu: 1 });

const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

export default Menu;
