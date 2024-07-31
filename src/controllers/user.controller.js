import { asyncHandler } from "../utils/asyncHandler.js"; // it is used to handle the async request
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) // we are not validating the user before saving because we are not updating the user, we are just updating the refreshToken
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

// it is an async function which takes request and response as an argument and it is wrapped inside the asyncHandler function to handle the async request
const registerUser = asyncHandler(async (req, res) => { 
 
    // get user details from frontend
    const {fullName, email, username, password} = req.body
    // console.log('********** req.body **********');
    // console.log(req.body);

    // validation - not empty
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists - username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser) throw new ApiError(409, "User with email or username already exists")

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path // by adding multer middleware, we can access the files from the request object and the path of the file is stored in the path property (we get the path from the first property of the avatar array)
    // console.log('********** req.files **********');
    // console.log(req.files);
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
        // In the previous case there is an issue, if there is no coverimage then no need to access coverImage[0]
    }
    if(!avatarLocalPath) throw new ApiError(400, "Avatar File is required")

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar) throw new ApiError(400, "Avatar File could not be uploaded")

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // cover image is optional so check if it exists
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from response and check if user is created
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) throw new (500, "Something went wrong while registering the user")
    
    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

const loginUser = asyncHandler (async (req, res) => {
    // req body -> data
    const {email, username, password} = req.body

    // username or email
    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }
    
    // find the user
    const user = await User.findOne({
        $or: [{ username }, { email }] // when we have multiple conditions then we use $or
    })
    if(!user) throw new ApiError(404, "User not found")

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password) // isPasswordCorrect is a custom method which we have created in the user model so we can access it using the user object
    if(!isPasswordValid) throw new ApiError(401, "Invalid user credentials")

    // access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    // send cookie
    const options = {
        httpOnly: true, 
        secure: true // now the cookies can only be modified from the server side not from the client side
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options) // key, value, options
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User loggedIn Succesfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})

export {
    registerUser, 
    loginUser, 
    logoutUser
}