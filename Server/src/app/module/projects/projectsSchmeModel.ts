import { model, Schema } from "mongoose";
import { projectsInterface } from "./projectsInterface";

// projects schema create with interface
const projectsSchema = new Schema<projectsInterface>({
    title: {
        type: String,
        required: [true, 'title field is required']
    },
    image: {
        type: String,
        default: null
    },
    description: {
        type: String,
        required: [true, 'Description field is required']
    },
    githubLink: {
        type: String,
        default: ''
    },
    liveLink: {
        type: String,
        default: ''
    },
    technologies: {
        type: String,
        required: [true, 'technologies field is required']
    },

}, { timestamps: true, versionKey: false })

// create model 
export const projectsModel = model<projectsInterface>('projects', projectsSchema)