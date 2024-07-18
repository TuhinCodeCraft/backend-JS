class ApiError extends Error {
    constructor(
        statuscode, 
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor) // It allows you to capture the current stack trace at the point where the method is called. A stack trace is a list of function calls that shows the sequence of function invocations that led to the current point in the code. Here, the this keyword refers to the current instance of the object, and this.constructor refers to the constructor function of the object.
        }
    }
}

export {ApiError}