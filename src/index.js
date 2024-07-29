// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
}) // to use this we need to add experimental feature in script in package.json

const port = process.env.PORT || 8000

connectDB() // it will return a promise
.then(() => {
    app.on("error", (error) => {
        console.log(`ERROR: ${error}`);
    })
    app.listen(port, () => {
        console.log(`Server is running on the port: ${port}`);
    })
}) 
.catch((error) => {
    console.log("MONGODB CONNECTION FAILED!!!: ", error);
})





/*
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

import express from "express";
const app = express();

// if some body forget to put ; at the end of the previous line
;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // Database name is mandatory
        app.on("error", (error) => {
            console.error("Error: ", error);
            throw error;
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
})() 
*/

// To communicate with the database we need to install mongoose package and you have to use async await to connect to the database cause it is in another continent and it will take time to connect to the database and we need to wait for it to connect to the database and then we can start the server and wrap it under try catch block to catch the error if there is any error while connecting to the database