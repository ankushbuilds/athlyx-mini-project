
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FiCamera,
    FiHome
} from "react-icons/fi";

import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyProfileEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isCreateMode =
        location.pathname === "/academy/create-profile";

    const [loadingProfile, setLoadingProfile] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [uploadingPhoto, setUploadingPhoto] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    // ==========================================
    // PROFILE PICTURE
    // ==========================================

    const [profilePic, setProfilePic] =
        useState("");

    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({
        academyName: "",
        sport: "",
        specialization: "",
        establishedYear: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        trainingPrograms: "",
        facilities: "",
        achievements: "",
        bio: "",
        isAvailable: true,
        website: "",
        instagram: "",
        facebook: ""
    });

    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {
        loadProfile();
    }, [isCreateMode]);

    const loadProfile = async () => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/auth", {
                replace: true
            });

            return;
        }

        try {
            setLoadingProfile(true);
            setError("");

            // ======================================
            // CREATE MODE
            // ======================================

            if (isCreateMode) {
                /*
                 * Create profile page intentionally
                 * starts with empty form.
                 *
                 * User profile picture is still loaded
                 * so an already uploaded photo can be
                 * displayed here as well.
                 */

                try {
                    const userResponse =
                        await axios.get(
                            `${API}/auth/me`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );

                    const user =
                        userResponse.data?.user ||
                        userResponse.data;

                    if (user) {
                        setProfilePic(
                            user.profilePic ||
                            ""
                        );

                        // Keep localStorage updated
                        localStorage.setItem(
                            "user",
                            JSON.stringify({
                                ...user,
                                profilePic:
                                    user.profilePic ||
                                    ""
                            })
                        );
                    }

                } catch (userError) {
                    console.error(
                        "Failed to load current user:",
                        userError
                    );
                }

                setLoadingProfile(false);
                return;
            }

            // ======================================
            // EDIT MODE
            // ======================================

            /*
             * IMPORTANT:
             * Load User separately because profilePic
             * belongs to User model.
             */

            const [userResponse, academyResponse] =
                await Promise.all([
                    axios.get(
                        `${API}/auth/me`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    ),

                    axios.get(
                        `${API}/academies/profile`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )
                ]);

            // ======================================
            // CURRENT USER
            // ======================================

            const user =
                userResponse.data?.user ||
                userResponse.data ||
                null;

            if (user) {
                console.log(
                    "CURRENT ACADEMY USER:",
                    user
                );

                console.log(
                    "CURRENT ACADEMY PROFILE PIC:",
                    user.profilePic
                );

                setProfilePic(
                    user.profilePic ||
                    ""
                );

                // Update localStorage
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...user,
                        profilePic:
                            user.profilePic ||
                            ""
                    })
                );
            }

            // ======================================
            // ACADEMY PROFILE
            // ======================================

            const profile =
                academyResponse.data?.academy ||
                academyResponse.data ||
                null;

            if (!profile) {
                setError(
                    "Academy profile not found."
                );

                return;
            }

            console.log(
                "ACADEMY EDIT PROFILE:",
                profile
            );

            // ======================================
            // PROFILE PICTURE FALLBACK
            // ======================================

            /*
             * Priority:
             *
             * 1. User from /auth/me
             * 2. academy.profilePic
             * 3. academy.user.profilePic
             */

            if (user?.profilePic) {
                setProfilePic(
                    user.profilePic
                );
            } else {
                setProfilePic(
                    profile.profilePic ||
                    profile.user?.profilePic ||
                    ""
                );
            }

            // ======================================
            // SOCIAL LINKS
            // ======================================

            const socialLinks =
                profile.socialLinks || {};

            // ======================================
            // FORM DATA
            // ======================================

            setFormData({
                academyName:
                    profile.academyName ||
                    "",

                sport:
                    profile.sport ||
                    "",

                specialization:
                    profile.specialization ||
                    "",

                establishedYear:
                    profile.establishedYear ||
                    "",

                phone:
                    profile.phone ||
                    "",

                address:
                    profile.address ||
                    "",

                city:
                    profile.city ||
                    "",

                state:
                    profile.state ||
                    "",

                // ==================================
                // ARRAY → STRING
                // ==================================

                trainingPrograms:
                    Array.isArray(
                        profile.trainingPrograms
                    )
                        ? profile.trainingPrograms.join(
                            ", "
                        )
                        : profile.trainingPrograms ||
                          "",

                facilities:
                    Array.isArray(
                        profile.facilities
                    )
                        ? profile.facilities.join(
                            ", "
                        )
                        : profile.facilities ||
                          "",

                achievements:
                    Array.isArray(
                        profile.achievements
                    )
                        ? profile.achievements
                            .map((item) => {
                                if (
                                    typeof item ===
                                    "string"
                                ) {
                                    return item;
                                }

                                return (
                                    item?.title ||
                                    item?.name ||
                                    ""
                                );
                            })
                            .filter(Boolean)
                            .join(", ")
                        : profile.achievements ||
                          "",

                bio:
                    profile.bio ||
                    "",

                isAvailable:
                    profile.isAvailable !==
                    undefined
                        ? profile.isAvailable
                        : true,

                website:
                    socialLinks.website ||
                    "",

                instagram:
                    socialLinks.instagram ||
                    "",

                facebook:
                    socialLinks.facebook ||
                    ""
            });

        } catch (error) {
            console.error(
                "Failed to load academy profile:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/auth", {
                    replace: true
                });

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load academy profile."
            );

        } finally {
            setLoadingProfile(false);
        }
    };

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData((prev) => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    // ==========================================
    // PROFILE PHOTO CLICK
    // ==========================================

    const handlePhotoClick = () => {
        document
            .getElementById(
                "academy-profile-photo-input"
            )
            ?.click();
    };

    // ==========================================
    // PROFILE PHOTO UPLOAD
    // SAME AS COACH PROFILE
    // ==========================================

    const handlePhotoChange = async (e) => {
        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        // ======================================
        // IMAGE VALIDATION
        // ======================================

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image."
            );

            e.target.value = "";

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Image size must be less than 5MB."
            );

            e.target.value = "";

            return;
        }

        const imageData =
            new FormData();

        imageData.append(
            "profilePic",
            file
        );

        try {
            setUploadingPhoto(true);
            setError("");
            setSuccessMessage("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/auth", {
                    replace: true
                });

                return;
            }

            // ======================================
            // UPLOAD TO SAME USER ENDPOINT
            // ======================================

            const response =
                await axios.post(
                    `${API}/users/profile-pic`,
                    imageData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            console.log(
                "PROFILE PHOTO RESPONSE:",
                response.data
            );

            const newProfilePic =
                response.data?.profilePic;

            if (!newProfilePic) {
                throw new Error(
                    "Profile picture URL was not returned."
                );
            }

            // ======================================
            // UPDATE UI IMMEDIATELY
            // ======================================

            setProfilePic(
                newProfilePic
            );

            // ======================================
            // UPDATE LOCAL STORAGE
            // ======================================

            const storedUser =
                localStorage.getItem(
                    "user"
                );

            if (storedUser) {
                try {
                    const user =
                        JSON.parse(
                            storedUser
                        );

                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...user,
                            profilePic:
                                newProfilePic
                        })
                    );

                } catch (storageError) {
                    console.error(
                        "Failed to update local user:",
                        storageError
                    );
                }
            }

            // ======================================
            // SUCCESS
            // ======================================

            setSuccessMessage(
                "Profile photo uploaded successfully."
            );

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

        } catch (error) {
            console.error(
                "Academy profile picture upload error:",
                error
            );

            if (
                error.response?.status ===
                401
            ) {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/auth", {
                    replace: true
                });

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to upload profile picture."
            );

        } finally {
            setUploadingPhoto(false);

            e.target.value = "";
        }
    };

    // ==========================================
    // SUBMIT PROFILE
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/auth", {
                    replace: true
                });

                return;
            }

            // ======================================
            // PREPARE DATA
            // ======================================

            const data = {
                academyName:
                    formData.academyName.trim(),

                sport:
                    formData.sport.trim(),

                specialization:
                    formData.specialization.trim(),

                establishedYear:
                    formData.establishedYear !== ""
                        ? Number(
                            formData.establishedYear
                        )
                        : undefined,

                phone:
                    formData.phone.trim(),

                address:
                    formData.address.trim(),

                city:
                    formData.city.trim(),

                state:
                    formData.state.trim(),

                trainingPrograms:
                    formData.trainingPrograms
                        .split(",")
                        .map(
                            (item) =>
                                item.trim()
                        )
                        .filter(Boolean),

                facilities:
                    formData.facilities
                        .split(",")
                        .map(
                            (item) =>
                                item.trim()
                        )
                        .filter(Boolean),

                achievements:
                    formData.achievements
                        .split(",")
                        .map(
                            (item) =>
                                item.trim()
                        )
                        .filter(Boolean),

                bio:
                    formData.bio.trim(),

                isAvailable:
                    formData.isAvailable,

                socialLinks: {
                    website:
                        formData.website.trim(),

                    instagram:
                        formData.instagram.trim(),

                    facebook:
                        formData.facebook.trim()
                }
            };

            // ======================================
            // VALIDATION
            // ======================================

            if (!data.academyName) {
                setError(
                    "Academy name is required."
                );

                setLoading(false);

                return;
            }

            if (!data.sport) {
                setError(
                    "Sport is required."
                );

                setLoading(false);

                return;
            }

            let response;

            // ======================================
            // CREATE
            // ======================================

            if (isCreateMode) {
                response =
                    await axios.post(
                        `${API}/academies/profile`,
                        data,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                setSuccessMessage(
                    "Academy profile created successfully!"
                );
            }

            // ======================================
            // UPDATE
            // ======================================

            else {
                response =
                    await axios.put(
                        `${API}/academies/profile`,
                        data,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                setSuccessMessage(
                    "Academy profile updated successfully!"
                );
            }

            console.log(
                "Academy profile response:",
                response.data
            );

            // ======================================
            // REDIRECT
            // ======================================

            setTimeout(() => {
                navigate(
                    "/academy/my-profile",
                    {
                        replace: true
                    }
                );
            }, 1200);

        } catch (error) {
            console.error(
                "Academy profile save error:",
                error
            );

            if (
                error.response?.status ===
                401
            ) {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/auth", {
                    replace: true
                });

                return;
            }

            setError(
                error.response?.data?.message ||
                (
                    isCreateMode
                        ? "Failed to create academy profile."
                        : "Failed to update academy profile."
                )
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loadingProfile) {
        return (
            <div className="athlete-layout">

                <AcademySidebar />

                <main className="athlete-profile-page">

                    <div className="profile-form-container">

                        <div className="profile-form-header">

                            <h1>
                                Loading Profile...
                            </h1>

                            <p>
                                Please wait while we load
                                your academy profile details.
                            </p>

                        </div>

                    </div>

                </main>

            </div>
        );
    }

    // ==========================================
    // MAIN
    // ==========================================

    return (
        <div className="athlete-layout">

            <AcademySidebar />

            <main className="athlete-profile-page">

                <div className="profile-form-container">

                    {/* ==================================
                        HEADER
                    ================================== */}

                    <div className="profile-form-header">

                        <h1>
                            {isCreateMode
                                ? "Create Academy Profile"
                                : "Edit Academy Profile"}
                        </h1>

                        <p>
                            {isCreateMode
                                ? "Create your academy profile and showcase your opportunities on Athlyx."
                                : "Update your academy details and keep your Athlyx profile up to date."}
                        </p>

                    </div>

                    {/* ==================================
                        SUCCESS
                    ================================== */}

                    {successMessage && (
                        <div className="profile-success">
                            {successMessage}
                        </div>
                    )}

                    {/* ==================================
                        ERROR
                    ================================== */}

                    {error && (
                        <div className="profile-error">
                            {error}
                        </div>
                    )}

                    {/* ==================================
                        PROFILE PHOTO
                    ================================== */}

                    <div className="profile-photo-section">

                        <div className="profile-photo-wrapper">

                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt="Academy Profile"
                                    className="profile-photo"
                                />
                            ) : (
                                <div className="profile-photo-placeholder">
                                    <FiHome />
                                </div>
                            )}

                            <button
                                type="button"
                                className="profile-photo-button"
                                onClick={
                                    handlePhotoClick
                                }
                                disabled={
                                    uploadingPhoto
                                }
                            >
                                <FiCamera />
                            </button>

                        </div>

                        <div className="profile-photo-info">

                            <h2>
                                Profile Photo
                            </h2>

                            <p>
                                {uploadingPhoto
                                    ? "Uploading photo..."
                                    : "Add a professional photo for your academy profile."}
                            </p>

                            <button
                                type="button"
                                className="change-photo-btn"
                                onClick={
                                    handlePhotoClick
                                }
                                disabled={
                                    uploadingPhoto
                                }
                            >
                                {uploadingPhoto
                                    ? "Uploading..."
                                    : profilePic
                                    ? "Change Photo"
                                    : "Upload Photo"}
                            </button>

                            <input
                                id="academy-profile-photo-input"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={
                                    handlePhotoChange
                                }
                                style={{
                                    display: "none"
                                }}
                            />

                        </div>

                    </div>

                    {/* ==================================
                        FORM
                    ================================== */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* ==================================
                            ACADEMY INFORMATION
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Academy Information
                            </h2>

                            <div className="form-group">

                                <label>
                                    Academy Name
                                </label>

                                <input
                                    type="text"
                                    name="academyName"
                                    value={
                                        formData.academyName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter academy name"
                                    required
                                />

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Sport
                                    </label>

                                    <select
                                        name="sport"
                                        value={
                                            formData.sport
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Sport
                                        </option>

                                        <option value="cricket">
                                            Cricket
                                        </option>

                                        <option value="football">
                                            Football
                                        </option>

                                        <option value="hockey">
                                            Hockey
                                        </option>

                                        <option value="basketball">
                                            Basketball
                                        </option>

                                        <option value="athletics">
                                            Athletics
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Specialization
                                    </label>

                                    <input
                                        type="text"
                                        name="specialization"
                                        value={
                                            formData.specialization
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Cricket Training Academy"
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Established Year
                                </label>

                                <input
                                    type="number"
                                    name="establishedYear"
                                    min="1800"
                                    max="2100"
                                    value={
                                        formData.establishedYear
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 2015"
                                />

                            </div>

                        </div>

                        {/* ==================================
                            CONTACT
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Contact Information
                            </h2>

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter phone number"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter academy address"
                                />

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter city"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={
                                            formData.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter state"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* ==================================
                            TRAINING PROGRAMS
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Training Programs
                            </h2>

                            <div className="form-group">

                                <label>
                                    Training Programs
                                </label>

                                <input
                                    type="text"
                                    name="trainingPrograms"
                                    value={
                                        formData.trainingPrograms
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Beginner Training, Advanced Training, Fitness"
                                />

                                <small>
                                    Separate multiple programs
                                    with commas.
                                </small>

                            </div>

                        </div>

                        {/* ==================================
                            FACILITIES
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Facilities
                            </h2>

                            <div className="form-group">

                                <label>
                                    Facilities
                                </label>

                                <input
                                    type="text"
                                    name="facilities"
                                    value={
                                        formData.facilities
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Ground, Gym, Indoor Practice Area"
                                />

                                <small>
                                    Separate multiple facilities
                                    with commas.
                                </small>

                            </div>

                        </div>

                        {/* ==================================
                            ACHIEVEMENTS
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Achievements
                            </h2>

                            <div className="form-group">

                                <label>
                                    Achievements
                                </label>

                                <input
                                    type="text"
                                    name="achievements"
                                    value={
                                        formData.achievements
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="State Champions, National Players"
                                />

                                <small>
                                    Separate multiple achievements
                                    with commas.
                                </small>

                            </div>

                        </div>

                        {/* ==================================
                            ABOUT
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                About Academy
                            </h2>

                            <div className="form-group">

                                <label>
                                    Bio
                                </label>

                                <textarea
                                    name="bio"
                                    maxLength="1000"
                                    value={
                                        formData.bio
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Tell athletes about your academy..."
                                />

                            </div>

                        </div>

                        {/* ==================================
                            ONLINE PRESENCE
                        ================================== */}

                        <div className="form-section">

                            <h2>
                                Online Presence
                            </h2>

                            <div className="form-group">

                                <label>
                                    Website
                                </label>

                                <input
                                    type="url"
                                    name="website"
                                    value={
                                        formData.website
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://example.com"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Instagram
                                </label>

                                <input
                                    type="url"
                                    name="instagram"
                                    value={
                                        formData.instagram
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://instagram.com/academy"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Facebook
                                </label>

                                <input
                                    type="url"
                                    name="facebook"
                                    value={
                                        formData.facebook
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://facebook.com/academy"
                                />

                            </div>

                        </div>

                        {/* ==================================
                            AVAILABILITY
                        ================================== */}

                        <div className="availability">

                            <label>

                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={
                                        formData.isAvailable
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                Available for opportunities

                            </label>

                        </div>

                        {/* ==================================
                            SAVE
                        ================================== */}

                        <button
                            type="submit"
                            className="save-profile-btn"
                            disabled={
                                loading ||
                                uploadingPhoto
                            }
                        >
                            {loading
                                ? isCreateMode
                                    ? "Creating..."
                                    : "Updating..."
                                : isCreateMode
                                ? "Create Academy Profile"
                                : "Update Academy Profile"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
};

export default AcademyProfileEdit;
