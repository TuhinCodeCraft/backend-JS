import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || name.trim() === "") throw new ApiError(400, "Playlist name is required");

    const playlist = await Playlist.create({
        name,
        description,
        user: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, "Playlist created successfully", playlist));
});

// Get playlists of a specific user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID");

    const playlists = await Playlist.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, "User playlists fetched successfully", playlists));
});

// Get playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");

    const playlist = await Playlist.findById(playlistId).populate("videos", "title url");

    if (!playlist) throw new ApiError(404, "Playlist not found");

    res.status(200).json(new ApiResponse(200, "Playlist fetched successfully", playlist));
});

// Add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", playlist));
});

// Remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    const videoIndex = playlist.videos.indexOf(videoId);
    if (videoIndex === -1) throw new ApiError(400, "Video not found in the playlist");

    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    res.status(200).json(new ApiResponse(200, "Video removed from playlist successfully", playlist));
});

// Delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
    if (!deletedPlaylist) throw new ApiError(404, "Playlist not found");

    res.status(200).json(new ApiResponse(200, "Playlist deleted successfully"));
});

// Update playlist details
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set: { name, description } },
        { new: true, runValidators: true }
    );

    if (!updatedPlaylist) throw new ApiError(404, "Playlist not found");

    res.status(200).json(new ApiResponse(200, "Playlist updated successfully", updatedPlaylist));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
