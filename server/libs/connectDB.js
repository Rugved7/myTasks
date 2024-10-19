import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log("Database connected successfully");

    } catch (error) {
        console.log("Error Connecting to Database", error);
        process.exit(1)
    }
}
export { connectDB }