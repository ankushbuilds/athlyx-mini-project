const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG, WEBP, MP4, WEBM and MOV files are allowed"
            ),
            false
        );
    }
};

const showcaseUpload = multer({
    storage,
    fileFilter,
    limits: {
        files: 10,
        fileSize: 50 * 1024 * 1024
    }
});

module.exports = showcaseUpload;