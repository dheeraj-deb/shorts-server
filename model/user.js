const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                let val = v.split("");
                return val.length > 6;
            },
            message: (props) => `${props.value} has to be grater than 6`,
        },
    },
    date_of_birth: {
        type: Date,
        required: true,
    },
    followers: [mongoose.SchemaTypes.ObjectId],
    following: [mongoose.SchemaTypes.ObjectId],
    posts: [mongoose.SchemaTypes.ObjectId],
    date: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
});

userSchema.pre("validate", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        throw new Error("hashing failed");
    }
});

module.exports = mongoose.model("User", userSchema);
