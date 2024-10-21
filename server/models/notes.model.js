import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
    {
        userId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
        },
        updatedAt: {
            type: Date
        }
    }, {
    timestamps: true
}
)

const Notes = mongoose.model("NotesSchema", notesSchema)
export default Notes