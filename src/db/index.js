import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // mongoose returns an object which contains the connection object, here we store the object in the connectionInstance variable
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        // console.log(connectionInstance);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED: ", error);
        process.exit(1) // explore more
    }
}

export default connectDB;