import mongoose, { Schema } from "mongoose";

export interface IAnlyze extends Document {
    user: mongoose.Schema.Types.ObjectId; 
    level: number
    
    ngay: Date;
    updatedAt: Date;
}
const AnlyzeSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        level: { type: Number, required: true },
       
        ngay: { type: Date, required: true, default: Date.now},
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Anlyze = mongoose.model<IAnlyze>('Anlyze', AnlyzeSchema);
export default Anlyze;