import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const existingLike = await Like.findOne({
        resource: videoId,
        user: req.user.id,
        type: "video",
    });

    if (existingLike) {
        // Unlike the video
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, "Video unliked successfully"));
    } else {
        // Like the video
        await Like.create({
            resource: videoId,
            user: req.user.id,
            type: "video",
        });
        return res.status(201).json(new ApiResponse(201, "Video liked successfully"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");

    const existingLike = await Like.findOne({
        resource: commentId,
        user: req.user.id,
        type: "comment",
    });

    if (existingLike) {
        // Unlike the comment
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, "Comment unliked successfully"));
    } else {
        // Like the comment
        await Like.create({
            resource: commentId,
            user: req.user.id,
            type: "comment",
        });
        return res.status(201).json(new ApiResponse(201, "Comment liked successfully"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

    const existingLike = await Like.findOne({
        resource: tweetId,
        user: req.user.id,
        type: "tweet",
    });

    if (existingLike) {
        // Unlike the tweet
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, "Tweet unliked successfully"));
    } else {
        // Like the tweet
        await Like.create({
            resource: tweetId,
            user: req.user.id,
            type: "tweet",
        });
        return res.status(201).json(new ApiResponse(201, "Tweet liked successfully"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({ user: req.user.id, type: "video" }).populate("resource", "title url");

    res.status(200).json(new ApiResponse(200, "Liked videos fetched successfully", likes));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
};
