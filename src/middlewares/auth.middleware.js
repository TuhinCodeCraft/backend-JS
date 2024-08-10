import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer, ", "")
        // when we send the request from the client side then we need to send the token in the header so we need to use req.header("Authorization") and the request is send like ```Bearer <token>``` so we need to remove the Bearer and space so we need to use replace("Bearer, ", "")
    
        if(!token) throw new ApiError(401, "Unauthorized request")
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user) {
            throw new ApiError(401, "Invalid access Token")
        }
    
        req.user = user // we are storing the user in the request object so that we can use it in the next middleware
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
    }
})