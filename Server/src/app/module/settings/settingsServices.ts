import { SettingsInterface } from "./settingsInterface";
import { settingsModel } from "./settingsSchemaModel";

const defaults: SettingsInterface = {
    siteName: "Shofiqul Islam",
    tagline: "Shopify Developer & Full-Stack Developer",
    contactEmail: "",
    githubUrl: "",
    facebookUrl: "",
    linkedinUrl: "",
    resumeUrl: "/resume.pdf",
    availability: "Available for selected projects",
};

const getSettings = async () => {
    const result = await settingsModel.findOne().lean();
    return { ...defaults, ...result };
};

const updateSettings = async (payload: Partial<SettingsInterface>) => {
    return settingsModel.findOneAndUpdate({}, { $set: payload }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
    }).lean();
};

export const settingsServices = { getSettings, updateSettings };