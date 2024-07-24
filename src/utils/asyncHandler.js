const asyncHandler = (requestHandler) => { // it that helps manage asynchronous request handlers
    return (req, res, next) => { // it is a higher order function that takes a request handler as an argument and returns a new request handler
        Promise
        .resolve(requestHandler(req, res, next)) // it ensures that the return value of the request handler is always a promise
        .catch((error)=> next(error)) // it ensures that any errors are properly propagated to the next middleware or error-handling middleware.
    }
}

export {asyncHandler}



// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }