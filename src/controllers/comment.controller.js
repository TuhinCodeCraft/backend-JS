import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.find({ video: videoId })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, "Comments fetched successfully", comments));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!text) {
        throw new ApiError(400, "Comment text is required");
    }

    const comment = await Comment.create({
        video: videoId,
        user: req.user.id,
        text,
    });

    res.status(201).json(new ApiResponse(201, "Comment added successfully", comment));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!text) {
        throw new ApiError(400, "Updated text is required");
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, user: req.user.id },
        { text },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized to update it");
    }

    res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOneAndDelete({ _id: commentId, user: req.user.id });

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized to delete it");
    }

    res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
};
