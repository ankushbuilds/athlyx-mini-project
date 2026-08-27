const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const showcaseUpload = require("../middleware/showcaseUpload.middleware");

const {
    createShowcasePost,
    getMyShowcasePosts,
    getAthletePublicShowcasePosts,
    updateShowcasePost,
    deleteShowcasePost
} = require("../controllers/showcase.controller");

router.post(
    "/create",
    authMiddleware,
    showcaseUpload.array("media", 10),
    createShowcasePost
);

router.get(
    "/my-posts",
    authMiddleware,
    getMyShowcasePosts
);

// ==========================================
// GET ATHLETE PUBLIC SHOWCASE POSTS
// ==========================================

router.get(
    "/athlete/:athleteId",
    authMiddleware,
    getAthletePublicShowcasePosts
);

router.put(
    "/update/:id",
    authMiddleware,
    showcaseUpload.array("media", 10),
    updateShowcasePost
);

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteShowcasePost
);

module.exports = router;