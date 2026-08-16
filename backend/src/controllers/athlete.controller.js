const Athlete = require("../models/athlete.model"); //create , find , update , delete

// ==========================================
// CREATE ATHLETE PROFILE
// ==========================================

async function createAthlete(req, res) {
    try {
        const userId = req.user.id;

        const existingAthlete = await Athlete.findOne({
            user: userId
        });

        if (existingAthlete) {
            return res.status(400).json({
                message: "Athlete profile already exists"
            });
        }

        const {
            profilePhoto,
            dateOfBirth,
            gender,
            phone,
            address,
            sport,
            position,
            experience,
            achievements,
            skills,
            bio,
            height,
            weight,
            socialLinks
        } = req.body; // request data from frontend

        if (!sport) {
            return res.status(400).json({
                message: "Sport is required"
            });
        }

        const athlete = await Athlete.create({
            user: userId,
            profilePhoto,
            dateOfBirth,
            gender,
            phone,
            address,
            sport,
            position,
            experience,
            achievements,
            skills,
            bio,
            height,
            weight,
            socialLinks
        });

        const populatedAthlete = await Athlete.findById(
            athlete._id
        ).populate("sport");

        return res.status(201).json({
            message: "Athlete profile created successfully",
            athlete: populatedAthlete
        });

    } catch (error) {
        console.error("Create athlete error:", error);

        return res.status(500).json({
            message: "Error creating athlete profile",
            error: error.message
        });
    }
}


// ==========================================
// GET MY ATHLETE PROFILE
// ==========================================

async function getMyAthleteProfile(req, res) {
    try {
        const athlete = await Athlete.findOne({
            user: req.user.id
        })
            .populate("user", "name email role")
            .populate("sport");

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete profile not found"
            });
        }

        return res.status(200).json({
            athlete
        });

    } catch (error) {
        console.error("Get athlete profile error:", error);

        return res.status(500).json({
            message: "Error fetching athlete profile",
            error: error.message
        });
    }
}


// ==========================================
// UPDATE MY ATHLETE PROFILE
// ==========================================

async function updateMyAthleteProfile(req, res) {
    try {
        const athlete = await Athlete.findOne({
            user: req.user.id
        });

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete profile not found"
            });
        }

        const allowedFields = [
            "profilePhoto",
            "dateOfBirth",
            "gender",
            "phone",
            "address",
            "sport",
            "position",
            "experience",
            "achievements",
            "skills",
            "bio",
            "height",
            "weight",
            "socialLinks",
            "isAvailable"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                athlete[field] = req.body[field];
            }
        });

        await athlete.save();

        const updatedAthlete = await Athlete.findById(
            athlete._id
        )
            .populate("user", "name email role")
            .populate("sport");

        return res.status(200).json({
            message: "Athlete profile updated successfully",
            athlete: updatedAthlete
        });

    } catch (error) {
        console.error("Update athlete profile error:", error);

        return res.status(500).json({
            message: "Error updating athlete profile",
            error: error.message
        });
    }
}


// ==========================================
// DELETE MY ATHLETE PROFILE
// ==========================================

async function deleteMyAthleteProfile(req, res) {
    try {
        const athlete = await Athlete.findOneAndDelete({
            user: req.user.id
        });

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete profile not found"
            });
        }

        return res.status(200).json({
            message: "Athlete profile deleted successfully"
        });

    } catch (error) {
        console.error("Delete athlete profile error:", error);

        return res.status(500).json({
            message: "Error deleting athlete profile",
            error: error.message
        });
    }
}


// ==========================================
// GET ALL ATHLETES
// ==========================================

async function getAllAthletes(req, res) {
    try {
        const athletes = await Athlete.find()
            .populate("user", "name email") //fetch the document from the collection
            .populate("sport");

        return res.status(200).json({
            count: athletes.length,
            athletes
        });

    } catch (error) {
        console.error("Get all athletes error:", error);

        return res.status(500).json({
            message: "Error fetching athletes",
            error: error.message
        });
    }
}


// ==========================================
// GET ATHLETE BY ID
// ==========================================

async function getAthleteById(req, res) {
    try {
        const athlete = await Athlete.findById(req.params.id)
            .populate("user", "name email")
            .populate("sport");

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete not found"
            });
        }

        return res.status(200).json({
            athlete
        });

    } catch (error) {
        console.error("Get athlete by ID error:", error);

        return res.status(500).json({
            message: "Error fetching athlete",
            error: error.message
        });
    }
}


module.exports = {
    createAthlete,
    getMyAthleteProfile,
    updateMyAthleteProfile,
    deleteMyAthleteProfile,
    getAllAthletes,
    getAthleteById
};