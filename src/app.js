import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) // use method is used to configure the middleware and any additional configuration settings

app.use(express.json({limit: "16kb"})) // we don't want to accept the data more than 16kb so we can use the limit property to limit the data
app.use(express.urlencoded({extended: true, limit: "16kb"})) // sometimes when the data is coming from the url there is some issue like tuhin%20 so we don't need that so the extended is true and limit is 16kb
app.use(express.static("public")) // sometimes we need to serve the static files like images, css, js files so we can use this method to serve the static files from the public folder
app.use(cookieParser()) // to access the cookies from the user browser and set the cokkies also

// routes:
import userRouter from './routes/user.routes.js' // only when export default otherwise you need to use {userRouter}

// routes declaration:
app.use("/api/v1/users", userRouter) // it will use the userRouter for the /api/v1/users route

// http://localhost:8000/api/v1/users/register // this is the route for the user registration, thus we will create routes for the user registration

export {app}