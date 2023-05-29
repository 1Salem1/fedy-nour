const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, max: 255 },
        email: { type: String, required: true, max: 255 },
        password: { type: String, required: true, min: 6, max: 1024 },
        role : {type: String, require: true}
    }
    , { timestamps: true }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await hash(this.password, 12);
    }
});

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id },"fedyNour123", { expiresIn: "4h" });
};

userSchema.set("toJSON", {
    transform: (
        doc,
        { __v, password, createdAt, updatedAt, ...rest },
        options
    ) => rest,
});

module.exports = mongoose.model('User', userSchema);