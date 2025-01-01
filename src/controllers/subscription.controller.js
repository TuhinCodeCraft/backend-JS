import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription for a channel
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user.id,
    });

    if (existingSubscription) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
    } else {
        // Subscribe
        await Subscription.create({
            channel: channelId,
            subscriber: req.user.id,
        });
        return res.status(201).json(new ApiResponse(201, "Subscribed successfully"));
    }
});

// Get the list of subscribers for a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "name email");

    res.status(200).json(new ApiResponse(200, "Subscribers fetched successfully", subscribers));
});

// Get the list of channels to which a user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber ID");

    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate("channel", "name description");

    res.status(200).json(new ApiResponse(200, "Subscribed channels fetched successfully", subscriptions));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
};
