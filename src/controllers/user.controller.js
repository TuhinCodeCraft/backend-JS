import { asyncHandler } from "../utils/asyncHandler.js"; // it is used to handle the async request
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export {registerUser}