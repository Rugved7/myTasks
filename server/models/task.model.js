import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        isCompleted: {
            type: Boolean,
            required: false,
        },
        createdAt: {
            type: Date.now(),
            required: true,
        },
        updatedAt: {
            type: Date,
        }
    }, { timestamps: true }
)

const Task = mongoose.model("Task", taskSchema)
export default Task