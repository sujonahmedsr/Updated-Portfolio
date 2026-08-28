import { model, Schema } from "mongoose";
import { TMessage } from "./messageInterface";

const messageSchema = new Schema<TMessage>({
    fullName: {
        type: String,
        required: [true, 'fullName field is required']
    },
    email: {
        type: String,
        required: [true, 'email field is required']
    },
    subject: {
        type: String,
        required: [true, 'subject field is required']
    },
    message: {
        type: String,
        required: [true, 'message field is required']
    },
}, { timestamps: true, versionKey: false })

// create model 
export const messageModel = model<TMessage>('messages', messageSchema)