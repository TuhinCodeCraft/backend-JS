import { Router } from "express"; // Router is a class so we need to use the curly braces
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router() // it will return an object which has all the methods like get, post, put, delete etc

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
) // post method is called when we need to create a new user

export default router