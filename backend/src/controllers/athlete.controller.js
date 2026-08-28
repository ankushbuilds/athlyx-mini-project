const Athlete = require("../models/athlete.model");

async function createAthlete(req, res) {
    try {
        const userId = req.user.id;

        const existingAthlete = await Athlete.findOne({ user: userId });

        if (existingAthlete) {
            return res.status(400).json({
                message: "Athlete profile already exists"
            });
        }

        const {
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
            socialLinks,
            isAvailable
        } = req.body;

        if (!sport || typeof sport !== "string" || !sport.trim()) {
            return res.status(400).json({
                message: "Sport is required"
            });
        }

        const athlete = await Athlete.create({
            user: userId,
            dateOfBirth: dateOfBirth || undefined,
            gender: gender || undefined,
            phone: phone || undefined,
            address: {
                city: address?.city || "",
                state: address?.state || "",
                country: address?.country || "India"
            },
            sport: sport.trim(),
            position: position || undefined,
            experience:
                experience !== undefined && experience !== ""
                    ? Number(experience)
                    : 0,
            achievements: Array.isArray(achievements)
                ? achievements
                : [],
            skills: Array.isArray(skills)
                ? skills
                : [],
            bio: bio || undefined,
            height:
                height !== undefined && height !== ""
                    ? Number(height)
                    : undefined,
            weight:
                weight !== undefined && weight !== ""
                    ? Number(weight)
                    : undefined,
            socialLinks: {
                instagram: socialLinks?.instagram || "",
                facebook: socialLinks?.facebook || "",
                youtube: socialLinks?.youtube || ""
            },
            isAvailable:
                typeof isAvailable === "boolean"
                    ? isAvailable
                    : true
        });

        const populatedAthlete = await Athlete.findById(athlete._id)
            .populate("user", "name email role profilePic");

        return res.status(201).json({
            message: "Athlete profile created successfully",
            athlete: populatedAthlete
        });
    } catch (error) {
        console.error("Create athlete error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Athlete profile already exists"
            });
        }

        return res.status(500).json({
            message: "Error creating athlete profile",
            error: error.message
        });
    }
}

async function getMyAthleteProfile(req, res) {
    try {
        const userId = req.user.id;

        const athlete = await Athlete.findOne({
            user: userId
        }).populate(
            "user",
            "name email role profilePic"
        );

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete profile not found"
            });
        }

        return res.status(200).json({
            message: "Athlete profile fetched successfully",
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

async function updateMyAthleteProfile(req, res) {
    try {
        const userId = req.user.id;

        const athlete = await Athlete.findOne({
            user: userId
        });

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete profile not found"
            });
        }

        const {
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
            socialLinks,
            isAvailable
        } = req.body;

        if (
            sport !== undefined &&
            (typeof sport !== "string" || !sport.trim())
        ) {
            return res.status(400).json({
                message: "Sport is required"
            });
        }

        if (dateOfBirth !== undefined) {
            athlete.dateOfBirth =
                dateOfBirth === ""
                    ? undefined
                    : dateOfBirth;
        }

        if (gender !== undefined) {
            athlete.gender =
                gender === ""
                    ? undefined
                    : gender;
        }

        if (phone !== undefined) {
            athlete.phone =
                phone === ""
                    ? undefined
                    : phone;
        }

        if (address !== undefined) {
            athlete.address = {
                city:
                    address.city !== undefined
                        ? address.city
                        : athlete.address?.city || "",
                state:
                    address.state !== undefined
                        ? address.state
                        : athlete.address?.state || "",
                country:
                    address.country !== undefined
                        ? address.country
                        : athlete.address?.country || "India"
            };
        }

        if (sport !== undefined) {
            athlete.sport = sport.trim();
        }

        if (position !== undefined) {
            athlete.position =
                position === ""
                    ? undefined
                    : position;
        }

        if (experience !== undefined) {
            athlete.experience =
                experience === ""
                    ? 0
                    : Number(experience);
        }

        if (achievements !== undefined) {
            athlete.achievements =
                Array.isArray(achievements)
                    ? achievements
                    : [];
        }

        if (skills !== undefined) {
            athlete.skills =
                Array.isArray(skills)
                    ? skills
                    : [];
        }

        if (bio !== undefined) {
            athlete.bio =
                bio === ""
                    ? undefined
                    : bio;
        }

        if (height !== undefined) {
            athlete.height =
                height === ""
                    ? undefined
                    : Number(height);
        }

        if (weight !== undefined) {
            athlete.weight =
                weight === ""
                    ? undefined
                    : Number(weight);
        }

        if (socialLinks !== undefined) {
            athlete.socialLinks = {
                instagram:
                    socialLinks.instagram !== undefined
                        ? socialLinks.instagram
                        : athlete.socialLinks?.instagram || "",
                facebook:
                    socialLinks.facebook !== undefined
                        ? socialLinks.facebook
                        : athlete.socialLinks?.facebook || "",
                youtube:
                    socialLinks.youtube !== undefined
                        ? socialLinks.youtube
                        : athlete.socialLinks?.youtube || ""
            };
        }

        if (isAvailable !== undefined) {
            athlete.isAvailable =
                typeof isAvailable === "boolean"
                    ? isAvailable
                    : Boolean(isAvailable);
        }

        await athlete.save();

        const updatedAthlete = await Athlete.findById(
            athlete._id
        ).populate(
            "user",
            "name email role profilePic"
        );

        return res.status(200).json({
            message: "Athlete profile updated successfully",
            athlete: updatedAthlete
        });
    } catch (error) {
        console.error(
            "Update athlete profile error:",
            error
        );

        return res.status(500).json({
            message: "Error updating athlete profile",
            error: error.message
        });
    }
}




async function getAllAthletes(req, res) {
    try {
        const {
            search,
            sport,
            city,
            state,
            position,
            experience
        } = req.query;

        const filter = {};

        /* ==========================================
           SPORT FILTER
           ========================================== */

        if (sport && sport.trim()) {
            filter.sport = {
                $regex: `^${sport.trim()}$`,
                $options: "i"
            };
        }

        /* ==========================================
           CITY FILTER
           ========================================== */

        if (city && city.trim()) {
            filter["address.city"] = {
                $regex: city.trim(),
                $options: "i"
            };
        }

        /* ==========================================
           STATE FILTER
           ========================================== */

        if (state && state.trim()) {
            filter["address.state"] = {
                $regex: state.trim(),
                $options: "i"
            };
        }

        /* ==========================================
           POSITION FILTER
           ========================================== */

        if (position && position.trim()) {
            filter.position = {
                $regex: position.trim(),
                $options: "i"
            };
        }

        /* ==========================================
           EXPERIENCE FILTER
           ========================================== */

        if (experience !== undefined && experience !== "") {
            const experienceValue = Number(experience);

            if (!Number.isNaN(experienceValue)) {
                filter.experience = {
                    $gte: experienceValue
                };
            }
        }

        /* ==========================================
           SEARCH USER + ATHLETE DATA
           ========================================== */

        let athletesQuery = Athlete.find(filter);

        const athletes = await athletesQuery
            .populate(
                "user",
                "name email role profilePic"
            );

        /* ==========================================
           SEARCH FILTER
           ========================================== */

        let filteredAthletes = athletes;

        if (search && search.trim()) {
            const searchValue = search.trim().toLowerCase();

            filteredAthletes = athletes.filter((athlete) => {
                const user = athlete.user || {};

                const name = (
                    user.name || ""
                ).toLowerCase();

                const athleteSport = (
                    athlete.sport || ""
                ).toLowerCase();

                const athletePosition = (
                    athlete.position || ""
                ).toLowerCase();

                const city = (
                    athlete.address?.city || ""
                ).toLowerCase();

                const state = (
                    athlete.address?.state || ""
                ).toLowerCase();

                return (
                    name.includes(searchValue) ||
                    athleteSport.includes(searchValue) ||
                    athletePosition.includes(searchValue) ||
                    city.includes(searchValue) ||
                    state.includes(searchValue)
                );
            });
        }

        /* ==========================================
           RESPONSE
           ========================================== */

        return res.status(200).json({
            count: filteredAthletes.length,
            athletes: filteredAthletes
        });

    } catch (error) {
        console.error(
            "Get all athletes error:",
            error
        );

        return res.status(500).json({
            message: "Error fetching athletes",
            error: error.message
        });
    }
}


async function getAthleteById(req, res) {
    try {
        if (
            req.user.role !== "coach" &&
            req.user.role !== "athlete"
        ) {
            return res.status(403).json({
                message: "You are not allowed to view athlete profiles"
            });
        }

        const athlete = await Athlete.findById(
            req.params.id
        ).populate(
            "user",
            "name email role profilePic"
        );

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete not found"
            });
        }

        return res.status(200).json({
            athlete
        });
    } catch (error) {
        console.error(
            "Get athlete by ID error:",
            error
        );

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
    getAllAthletes,
    getAthleteById
};