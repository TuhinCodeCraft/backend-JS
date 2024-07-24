import { asyncHandler } from "../utils/asyncHandler.js"; // it is used to handle the async request

const registerUser = asyncHandler(async (req, res) => { // it is an async function which takes request and response as an argument and it is wrapped inside the asyncHandler function to handle the async request
    res.status(400).json({ // it will send the response to the client
        message: "user registered" // it will send the message to the client
    })
})

export {registerUser}