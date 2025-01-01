import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") throw new ApiError(400, "Content cannot be empty");

    const tweet = await Tweet.create({
        content,
        user: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, "Tweet created successfully", tweet));
});

// Get tweets of a specific user
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID");

    const tweets = await Tweet.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, "User tweets fetched successfully", tweets));
});

// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");
    if (!content || content.trim() === "") throw new ApiError(400, "Content cannot be empty");

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { new: true, runValidators: true }
    );

    if (!updatedTweet) throw new ApiError(404, "Tweet not found");

    res.status(200).json(new ApiResponse(200, "Tweet updated successfully", updatedTweet));
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
    if (!deletedTweet) throw new ApiError(404, "Tweet not found");

    res.status(200).json(new ApiResponse(200, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
};
