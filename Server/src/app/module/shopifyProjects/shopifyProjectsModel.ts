import { Schema, model } from "mongoose";
import { IShopifyProject } from "./shopifyProjectsInterface";

const shopifyProjectsSchema = new Schema<IShopifyProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    clientName: {
      type: String,
      default: "",
      trim: true,
    },
    fullPageScreenshot: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "E-Commerce",
      trim: true,
    },
    theme: {
      type: String,
      default: "Custom Liquid",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    liveUrl: {
      type: String,
      required: [true, "Live URL is required"],
      trim: true,
    },
    storePassword: {
      type: String,
      default: "",
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Published", "In Development", "Completed"],
      default: "Published",
    },
    completionDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const shopifyProjectsModel = model<IShopifyProject>(
  "ShopifyProject",
  shopifyProjectsSchema
);
