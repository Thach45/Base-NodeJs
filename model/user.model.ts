import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  fullName: string;
  isSurvey: boolean;
  messages: mongoose.Schema.Types.ObjectId[];
  password: string; 
  role: string; 
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    isSurvey: { type: Boolean, default: false },
    messages: { type: mongoose.Schema.Types.ObjectId, ref: 'messages' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;