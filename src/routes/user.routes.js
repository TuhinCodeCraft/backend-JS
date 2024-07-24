import { Router } from "express"; // Router is a class so we need to use the curly braces
import { registerUser } from "../controllers/user.controller.js";

const router = Router() // it will return an object which has all the methods like get, post, put, delete etc

router.route("/register").post(registerUser) // post method is called when we need to create a new user

export default router