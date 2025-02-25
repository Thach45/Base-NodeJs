import mongoose from 'mongoose';


export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed');
    }
}
