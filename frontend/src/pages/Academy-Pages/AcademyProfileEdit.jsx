import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyProfileEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ==========================================
    // CREATE / EDIT MODE
    // ==========================================

    const isCreateMode =
        location.pathname === "/academy/create-profile";

    const isEditMode = !isCreateMode;

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

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // FETCH PROFILE
    // ==========================================

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/auth", {
                    replace: true
                });

                return;
            }

            if (isCreateMode) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API}/academies/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const academy =
                    response.data?.academy ||
                    response.data?.profile ||
                    response.data;

                if (!academy) {
                    setError(
                        "Academy profile not found. Please create your profile first."
                    );

                    setTimeout(() => {
                        navigate(
                            "/academy/create-profile",
                            {
                                replace: true
                            }
                        );
                    }, 1000);

                    return;
                }

                setFormData({
                    academyName:
                        academy.academyName || "",

                    sport:
                        academy.sport || "",

                    specialization:
                        academy.specialization || "",

                    establishedYear:
                        academy.establishedYear || "",

                    phone:
                        academy.phone || "",

                    address:
                        academy.address || "",

                    city:
                        academy.city || "",

                    state:
                        academy.state || "",

                    trainingPrograms:
                        Array.isArray(
                            academy.trainingPrograms
                        )
                            ? academy.trainingPrograms.join(", ")
                            : academy.trainingPrograms || "",

                    facilities:
                        Array.isArray(
                            academy.facilities
                        )
                            ? academy.facilities.join(", ")
                            : academy.facilities || "",

                    achievements:
                        Array.isArray(
                            academy.achievements
                        )
                            ? academy.achievements.join(", ")
                            : academy.achievements || "",

                    bio:
                        academy.bio || "",

                    isAvailable:
                        academy.isAvailable ?? true,

                    website:
                        academy.socialLinks?.website || "",

                    instagram:
                        academy.socialLinks?.instagram || "",

                    facebook:
                        academy.socialLinks?.facebook || ""
                });
            } catch (err) {
                console.error(
                    "Failed to fetch academy profile:",
                    err
                );

                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/auth", {
                        replace: true
                    });

                    return;
                }

                if (err.response?.status === 404) {
                    setError(
                        "Academy profile does not exist. Please create it first."
                    );

                    setTimeout(() => {
                        navigate(
                            "/academy/create-profile",
                            {
                                replace: true
                            }
                        );
                    }, 1000);

                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Failed to load academy profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, isCreateMode]);

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
    // STRING -> ARRAY
    // ==========================================

    const convertToArray = (value) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    };

    // ==========================================
    // CREATE / UPDATE
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/auth", {
                replace: true
            });

            return;
        }

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!formData.academyName.trim()) {
            setError(
                "Academy name is required."
            );

            return;
        }

        if (!formData.sport.trim()) {
            setError(
                "Sport is required."
            );

            return;
        }

        // ==========================================
        // ESTABLISHED YEAR VALIDATION
        // ==========================================

        if (formData.establishedYear) {
            const year =
                Number(formData.establishedYear);

            const currentYear =
                new Date().getFullYear();

            if (
                !Number.isInteger(year) ||
                year < 1800 ||
                year > currentYear
            ) {
                setError(
                    `Established year must be between 1800 and ${currentYear}.`
                );

                return;
            }
        }

        // ==========================================
        // PAYLOAD
        // ==========================================

        const payload = {
            academyName:
                formData.academyName.trim(),

            sport:
                formData.sport.trim(),

            specialization:
                formData.specialization.trim(),

            establishedYear:
                formData.establishedYear
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
                convertToArray(
                    formData.trainingPrograms
                ),

            facilities:
                convertToArray(
                    formData.facilities
                ),

            achievements:
                convertToArray(
                    formData.achievements
                ),

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

        try {
            setSaving(true);

            // ==========================================
            // CREATE
            // ==========================================

            if (isCreateMode) {
                const response =
                    await axios.post(
                        `${API}/academies/profile`,
                        payload,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setSuccess(
                    response.data?.message ||
                    "Academy profile created successfully."
                );
            }

            // ==========================================
            // UPDATE
            // ==========================================

            else {
                const response =
                    await axios.put(
                        `${API}/academies/profile`,
                        payload,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setSuccess(
                    response.data?.message ||
                    "Academy profile updated successfully."
                );
            }

            // ==========================================
            // REDIRECT
            // ==========================================

            setTimeout(() => {
                navigate(
                    "/academy/my-profile",
                    {
                        replace: true
                    }
                );
            }, 800);
        } catch (err) {
            console.error(
                "Academy profile save error:",
                err
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/auth", {
                    replace: true
                });

                return;
            }

            setError(
                err.response?.data?.message ||
                (
                    isCreateMode
                        ? "Failed to create academy profile."
                        : "Failed to update academy profile."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-layout">

                <AcademySidebar />

                <main className="athlete-profile-page">

                    <div className="profile-form-container">

                        <div className="coach-athletes-loading">
                            Loading profile...
                        </div>

                    </div>

                </main>

            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="dashboard-layout">

            <AcademySidebar />

            <main className="athlete-profile-page">

                <div className="profile-form-container">

                    {/* ======================================
                        HEADER
                    ====================================== */}

                    <div className="profile-form-header">

                        <div>

                            <span className="page-eyebrow">
                                ACADEMY PROFILE
                            </span>

                            <h1>
                                {isCreateMode
                                    ? "Create Academy Profile"
                                    : "Edit Academy Profile"}
                            </h1>

                            <p>
                                {isCreateMode
                                    ? "Create your academy profile so athletes and coaches can discover your academy."
                                    : "Keep your academy information updated for athletes and coaches."}
                            </p>

                        </div>

                    </div>

                    {/* ======================================
                        ERROR
                    ====================================== */}

                    {error && (
                        <div className="profile-error">
                            {error}
                        </div>
                    )}

                    {/* ======================================
                        SUCCESS
                    ====================================== */}

                    {success && (
                        <div className="profile-success">
                            {success}
                        </div>
                    )}

                    {/* ======================================
                        FORM
                    ====================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="profile-form"
                    >

                        {/* ======================================
                            BASIC INFORMATION
                        ====================================== */}

                        <section className="form-section">

                            <div className="form-section-header">

                                <div>
                                    <span className="page-eyebrow">
                                        BASIC INFORMATION
                                    </span>

                                    <h2>
                                        Academy Details
                                    </h2>


                                </div>

                            </div>

                            <div className="form-row">

                                {/* ACADEMY NAME */}

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
                                        onChange={handleChange}
                                        placeholder="Enter academy name"
                                        required
                                    />

                                </div>

                                {/* SPORT */}

                                <div className="form-group">

                                    <label>
                                        Sport
                                    </label>

                                    <input
                                        type="text"
                                        name="sport"
                                        value={
                                            formData.sport
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. Cricket, Football"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                {/* SPECIALIZATION */}

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
                                        onChange={handleChange}
                                        placeholder="Enter specialization"
                                    />

                                </div>

                                {/* ESTABLISHED YEAR */}

                                <div className="form-group">

                                    <label>
                                        Established Year
                                    </label>

                                    <input
                                        type="number"
                                        name="establishedYear"
                                        value={
                                            formData.establishedYear
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 2015"
                                        min="1800"
                                        max={
                                            new Date().getFullYear()
                                        }
                                    />

                                </div>

                            </div>

                        </section>

                        {/* ======================================
                            CONTACT & LOCATION
                        ====================================== */}

                        <section className="form-section">

                            <div className="form-section-header">

                                <div>
                                    <span className="page-eyebrow">
                                        CONTACT & LOCATION
                                    </span>

                                    <h2>
                                        Contact Details
                                    </h2>


                                </div>

                            </div>

                            <div className="form-row">

                                {/* PHONE */}

                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />

                                </div>

                                {/* CITY */}

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
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                {/* STATE */}

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
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                    />

                                </div>

                                {/* ADDRESS */}

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
                                        onChange={handleChange}
                                        placeholder="Enter academy address"
                                    />

                                </div>

                            </div>

                        </section>

                        {/* ======================================
                            ACADEMY INFORMATION
                        ====================================== */}

                        <section className="form-section">

                            <div className="form-section-header">

                                <div>
                                    <span className="page-eyebrow">
                                        ACADEMY INFORMATION
                                    </span>

                                    <h2>
                                        Training & Facilities
                                    </h2>


                                </div>

                            </div>

                            {/* TRAINING PROGRAMS */}

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
                                    onChange={handleChange}
                                    placeholder="e.g. Batting, Bowling, Fitness"
                                />

                                <small>
                                    Separate multiple programs
                                    with commas.
                                </small>

                            </div>

                            {/* FACILITIES */}

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
                                    onChange={handleChange}
                                    placeholder="e.g. Gym, Nets, Ground"
                                />

                                <small>
                                    Separate multiple facilities
                                    with commas.
                                </small>

                            </div>

                            {/* ACHIEVEMENTS */}

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
                                    onChange={handleChange}
                                    placeholder="Enter achievements"
                                />

                                <small>
                                    Separate multiple achievements
                                    with commas.
                                </small>

                            </div>

                            {/* BIO */}

                            <div className="form-group">

                                <label>
                                    About Academy
                                </label>

                                <textarea
                                    name="bio"
                                    value={
                                        formData.bio
                                    }
                                    onChange={handleChange}
                                    placeholder="Tell athletes and coaches about your academy"
                                    rows="5"
                                />

                            </div>

                        </section>

                        {/* ======================================
                            ONLINE PRESENCE
                        ====================================== */}

                        <section className="form-section">

                            <div className="form-section-header">

                                <div>
                                    <span className="page-eyebrow">
                                        ONLINE PRESENCE
                                    </span>

                                    <h2>
                                        Social Links
                                    </h2>

                                </div>

                            </div>

                            <div className="form-row">

                                {/* WEBSITE */}

                                <div className="form-group">

                                    <label>
                                        Website
                                    </label>

                                    <input
                                        type="text"
                                        name="website"
                                        value={
                                            formData.website
                                        }
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                    />

                                </div>

                                {/* INSTAGRAM */}

                                <div className="form-group">

                                    <label>
                                        Instagram
                                    </label>

                                    <input
                                        type="text"
                                        name="instagram"
                                        value={
                                            formData.instagram
                                        }
                                        onChange={handleChange}
                                        placeholder="Instagram profile URL"
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                {/* FACEBOOK */}

                                <div className="form-group">

                                    <label>
                                        Facebook
                                    </label>

                                    <input
                                        type="text"
                                        name="facebook"
                                        value={
                                            formData.facebook
                                        }
                                        onChange={handleChange}
                                        placeholder="Facebook profile URL"
                                    />

                                </div>

                               
                                        
                              

                            </div>

                        </section>

                        {/* ======================================
                            BUTTONS
                        ====================================== */}

                        <div className="profile-form-actions">

                            <button
                                type="button"
                                className="cancel-profile-btn"
                                onClick={() =>
                                    navigate(
                                        "/academy/my-profile"
                                    )
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-profile-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : isCreateMode
                                        ? "Create Profile"
                                        : "Update Profile"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
};

export default AcademyProfileEdit;