import mongoose, { Schema } from "mongoose";

export interface IMessage extends Document {
    user:  mongoose.Schema.Types.ObjectId; // User ID
    message: string; 
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);
const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;