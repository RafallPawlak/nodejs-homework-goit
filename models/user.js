const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const users = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
         password: {
            type: String,
            required: [true, 'Password is required'],
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        avatarURL: {
            type: String,
        },
        token: {
            type: String,
            default: null,
        }
    }, { versionKey: false, timestamps: true });

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  avatarURL: Joi.string(),
});

const hashPassword = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(pass, salt);
  return hashedPassword;
};

const User = mongoose.model("user", users);

module.exports = { User, userSchema: userValidationSchema, hashPassword }; 