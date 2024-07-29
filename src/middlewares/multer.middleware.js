import multer from "multer";

const storage = multer.diskStorage({ // This method is used to configure storage settings for multer to store files on disk. You can alternatively use memoryStorage to store files in memory, but this is not recommended for large files, diskStorage is used to store the file on the disk storage of the server. MemoryStorage is used to store the file in the memory of the server
  destination: function (req, file, cb) { // This is a callback function that specifies the directory where the uploaded files will be stored. In this case, files will be stored in the ./public/temp directory
    cb(null, "./public/temp"); // This cb function has take two arguments, first one is if there is any error, in this case null is used cause of no error
  },
  filename: function (req, file, cb) { // This is a callback function that specifies the name under which the file will be stored. Here, it uses the original name of the file uploaded by the user
    cb(null, file.originalname); // originalname is the name of the file that is uploaded by the user, the file will stored in the server for some time and then it will be uploaded on cloudinary so we are storing the file with the original name
  },
});

export const upload = multer({ // This exports the upload middleware so that it can be used in other parts of your application to handle file uploads
  storage, // This initializes multer with the storage configuration defined earlier
});
