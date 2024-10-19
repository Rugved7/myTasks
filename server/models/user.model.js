import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name field cannot be empty"]
        },
        email: {
            type: String,
            required: [true, "Email field cannot be empty"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password field cannot be empty"]
        },
        task: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task"
            }
        ],
        notes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Notes"
            }
        ]
    },
    { timestamps: true }
)


// Password Hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
        console.log("Error hashing password", error);

    }
})

// Comparing paswords --> used while logging in 
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)
export default User