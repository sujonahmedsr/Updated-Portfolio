import { model, Schema } from "mongoose";
import { blogsInterface } from "./blogsInterface";

// projects schema create with interface
const blogsSchema = new Schema<blogsInterface>({
    title: {
        type: String,
        required: [true, 'title field is required']
    },
    image: {
        type: String,
        required: [true, 'Image field is required']
    },
    description: {
        type: String,
        required: [true, 'Description field is required']
    },
}, { timestamps: true, versionKey: false })

// create model 
export const blogsModel = model<blogsInterface>('blogs', blogsSchema)