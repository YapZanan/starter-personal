import mongoose from "mongoose";
import { z } from "zod";
import { zodSchema } from "@zodyac/zod-mongoose";
import { zTrackingSchema } from "@/schema/trackingSchema";

const trackingSchema = zodSchema(zTrackingSchema);

trackingSchema.pre("save", async function (next) {
	next();
});

trackingSchema.index({ Tracking: 1 });

const Tracking =
	mongoose.models.Tracking || mongoose.model("Tracking", trackingSchema);

export default Tracking;
