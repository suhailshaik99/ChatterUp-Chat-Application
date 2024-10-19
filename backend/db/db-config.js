import mongoose, { mongo } from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Application connected to database successfully...!");
    } catch (error) {
        throw new Error(error.message);
    }
}