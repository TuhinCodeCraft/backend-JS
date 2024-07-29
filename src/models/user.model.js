// when mongodb saved user then automatically generate an unique id, mongodb saved the data as bson(Binary JSON) data

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; // bearer token (who have this token can access data)
import bcrypt from "bcrypt" // For more security we need to encrypt our password but after encryption it will store a fixed length random string which is not compareable so wee need this bcrypt to compare. It is based on cryptography 

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // For better searching in DB
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// before saving your data pre hook will run whatever you write in it
userSchema.pre("save", async function (next) { // arrow function does not have access to this keyword so we need to use function keyword, it will take some time to hash the password so we need to use async-await, being a middleware it will take next as a parameter
  if(!this.isModified("password")) return next() // if password is not modified then return next, only when the password is modified then hash the password

  this.password = await bcrypt.hash(this.password, 10) // 10 is the number of rounds of hashing
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) { // methods is an object which is used to add custom methods to the schema, this custom method will take password as a parameter
  return await bcrypt.compare(password, this.password) // when user login then we need to compare the password with the hashed password, so we need to use bcrypt.compare(password, hashedPassword) it will return true or false
  // compare runs in the crytography mechanism so it will take time, so we need to use await
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign( // used to generate token
    { // payload
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key
    { // options
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { // payload
      _id: this._id, // contain less data than access token
    },
    process.env.REFRESH_TOKEN_SECRET, // secret key
    { // options
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema);
