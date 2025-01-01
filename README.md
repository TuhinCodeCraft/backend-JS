# YouTube Backend

A backend implementation for a platform similar to YouTube. This project provides APIs for video management, user management, comments, likes, playlists, subscriptions, and more.

## Features

- **User Authentication**: Login and registration using JWT and password hashing with bcrypt.
- **Video Management**: Upload, update, delete, and fetch videos.
- **Comments**: Add, update, delete, and fetch comments on videos.
- **Likes**: Like/unlike videos, comments, and tweets.
- **Playlists**: Create, update, delete, and manage playlists.
- **Subscriptions**: Manage subscriptions and fetch subscriber lists.
- **Cloudinary Integration**: Video and thumbnail upload to Cloudinary.
- **Pagination**: Efficient data fetching with pagination for videos, comments, and playlists.

## Tech Stack

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **Cloudinary**: Media management and hosting.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/youtube-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd youtube-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Start the development server with `nodemon`.

## Dependencies

- `bcrypt`: For password hashing.
- `cloudinary`: For media upload and management.
- `cookie-parser`: For parsing cookies.
- `cors`: To enable Cross-Origin Resource Sharing.
- `dotenv`: For environment variable management.
- `express`: For building APIs.
- `jsonwebtoken`: For user authentication.
- `mongoose`: For MongoDB object modeling.
- `mongoose-aggregate-paginate-v2`: For efficient pagination.
- `multer`: For handling file uploads.

## Dev Dependencies

- `nodemon`: For hot-reloading during development.
- `prettier`: For code formatting.

## Author

**Tuhin Ghosh**

## License

This project is licensed under the ISC License.

## Keywords

- JavaScript
- Backend
- Tuhin

