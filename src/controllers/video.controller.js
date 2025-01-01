import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all videos with filtering, sorting, and pagination
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const filter = {};
    if (query) filter.title = { $regex: query, $options: "i" };
    if (userId && isValidObjectId(userId)) filter.user = userId;

    const options = {
        sort: { [sortBy]: sortType === "asc" ? 1 : -1 },
        skip: (page - 1) * limit,
        limit: parseInt(limit, 10),
    };

    const videos = await Video.find(filter, null, options);
    const total = await Video.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, "Videos fetched successfully", { videos, total, page, limit }));
});

// Publish a video after uploading to Cloudinary
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { file } = req;

    if (!file) throw new ApiError(400, "Video file is required");

    const cloudinaryResult = await uploadOnCloudinary(file.path, "video");

    const newVideo = await Video.create({
        title,
        description,
        videoUrl: cloudinaryResult.secure_url,
        thumbnailUrl: cloudinaryResult.thumbnail_url || "",
        user: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, "Video published successfully", newVideo));
});

// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    res.status(200).json(new ApiResponse(200, "Video fetched successfully", video));
});

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnailUrl } = req.body;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: { title, description, thumbnailUrl } },
        { new: true, runValidators: true }
    );

    if (!updatedVideo) throw new ApiError(404, "Video not found");

    res.status(200).json(new ApiResponse(200, "Video updated successfully", updatedVideo));
});

// Delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) throw new ApiError(404, "Video not found");

    res.status(200).json(new ApiResponse(200, "Video deleted successfully"));
});

// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(200, "Video publish status toggled successfully", { isPublished: video.isPublished }));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
