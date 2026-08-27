const Showcase = require("../models/showcase.model");
const Athlete = require("../models/athlete.model");
const imagekit = require("../config/imagekit");

const getAthleteByUser = async (userId) => {
    return await Athlete.findOne({
        user: userId
    });
};

const uploadMedia = async (files) => {
    const media = [];

    for (const file of files) {
        const uploadedFile = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "/athlyx/showcase"
        });

        media.push({
            url: uploadedFile.url,
            type: file.mimetype.startsWith("video/")
                ? "video"
                : "image",
            fileId: uploadedFile.fileId
        });
    }

    return media;
};

const deleteMediaFromImageKit = async (media) => {
    for (const item of media) {
        if (!item.fileId) {
            continue;
        }

        try {
            await imagekit.deleteFile(item.fileId);
        } catch (error) {
            console.error(
                "ImageKit Media Delete Error:",
                error.message
            );
        }
    }
};

const createShowcasePost = async (req, res) => {
    try {
        const { caption, visibility = "public" } = req.body;
        const athlete = await getAthleteByUser(req.user.id);

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found"
            });
        }

        if (
            (!caption || !caption.trim()) &&
            (!req.files || req.files.length === 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Caption or media is required"
            });
        }

        const media = req.files?.length
            ? await uploadMedia(req.files)
            : [];

        const showcasePost = await Showcase.create({
            athlete: athlete._id,
            caption: caption?.trim() || "",
            media,
            visibility
        });

        return res.status(201).json({
            success: true,
            message: "Showcase post created successfully",
            post: showcasePost
        });
    } catch (error) {
        console.error(
            "Create Showcase Post Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create showcase post",
            error: error.message
        });
    }
};

const getMyShowcasePosts = async (req, res) => {
    try {
        const athlete = await getAthleteByUser(req.user.id);

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found"
            });
        }

        const posts = await Showcase.find({
            athlete: athlete._id
        })
        .populate({
            path: "athlete",
            populate: {
                path: "user",
                select: "name profilePic"
            }
        })
        .sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error(
            "Get Showcase Posts Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch showcase posts",
            error: error.message
        });
    }
};

const updateShowcasePost = async (req, res) => {
    try {
        const { caption, visibility } = req.body;
        const { id } = req.params;

        const athlete = await getAthleteByUser(req.user.id);

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found"
            });
        }

        const post = await Showcase.findOne({
            _id: id,
            athlete: athlete._id
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Showcase post not found"
            });
        }

        if (caption !== undefined) {
            post.caption = caption.trim();
        }

        if (visibility !== undefined) {
            post.visibility = visibility;
        }

        if (req.files?.length) {
            const newMedia = await uploadMedia(req.files);

            await deleteMediaFromImageKit(post.media);

            post.media = newMedia;
        }

        if (
            !post.caption &&
            post.media.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Caption or media is required"
            });
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Showcase post updated successfully",
            post
        });
    } catch (error) {
        console.error(
            "Update Showcase Post Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update showcase post",
            error: error.message
        });
    }
};

const deleteShowcasePost = async (req, res) => {
    try {
        const { id } = req.params;

        const athlete = await getAthleteByUser(req.user.id);

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found"
            });
        }

        const post = await Showcase.findOne({
            _id: id,
            athlete: athlete._id
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Showcase post not found"
            });
        }

        await deleteMediaFromImageKit(post.media);

        await Showcase.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Showcase post deleted successfully"
        });
    } catch (error) {
        console.error(
            "Delete Showcase Post Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete showcase post",
            error: error.message
        });
    }
};

const getAthletePublicShowcasePosts = async (req, res) => {
    try {
        const { athleteId } = req.params;

        const athlete = await Athlete.findById(athleteId);

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete not found"
            });
        }

        const posts = await Showcase.find({
            athlete: athlete._id,
            visibility: "public"
        })
            .populate({
                path: "athlete",
                populate: {
                    path: "user",
                    select: "name profilePic"
                }
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error(
            "Get Athlete Public Showcase Posts Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch athlete showcase posts",
            error: error.message
        });
    }
};

module.exports = {
    createShowcasePost,
    getMyShowcasePosts,
    updateShowcasePost,
    deleteShowcasePost,
    getAthletePublicShowcasePosts
};