import {v2 as cloudinary} from "cloudinary" // import the latest version of cloudinary
import fs from "fs" 
// fs stands for file system which automatically comes up with node js , no need to install externally. It helps to read, write, remove a file with sync and async method.

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}); // configure cloudinary with the credentials

const uploadOnCloudinary = async (localFilePath) => { // it will take time to upload the file on cloudinary so we are using async function and the file path is passed as an argument
    try { // try block is used to handle the error that may occur during the execution of the code
        if (!localFilePath) return null // if the file path is not provided then return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // it will automatically detect the type of the file like image, video, audio etc
        })
        console.log("File is uploaded on cloudinary ", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // if the file is not uploaded on cloudinary from the server then remove the file from the local storage and Sync is used to remove the file synchronously 
        return null;
    }
}

export {uploadOnCloudinary}