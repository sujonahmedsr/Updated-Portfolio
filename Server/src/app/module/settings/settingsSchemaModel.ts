import { model, Schema } from "mongoose";
import { SettingsInterface } from "./settingsInterface";

const settingsSchema = new Schema<SettingsInterface>({
    siteName: { type: String, default: "Shofiqul Islam" },
    tagline: { type: String, default: "Shopify Developer & Full-Stack Developer" },
    contactEmail: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "/resume.pdf" },
    availability: { type: String, default: "Available for selected projects" },
}, { timestamps: true, versionKey: false });

export const settingsModel = model<SettingsInterface>("settings", settingsSchema);