import { useEffect, useState } from "react";
import axios from "axios";
import {
    FiSettings,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiLock,
    FiSave,
    FiArrowLeft
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import ScoutSidebar from "../../components/ScoutSidebar";

const API = "http://localhost:5000/api";

const ScoutSettings = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] =
        useState(false);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // =====================================================
    // FETCH SETTINGS
    // =====================================================

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API}/auth/me`,
                config
            );

            const user =
                response.data?.user ||
                response.data;

            setProfile({
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                address: user?.address || ""
            });

        } catch (error) {
            console.error(
                "Failed to fetch settings:",
                error
            );

            // Fallback to localStorage
            try {
                const storedUser =
                    JSON.parse(
                        localStorage.getItem("user")
                    );

                if (storedUser) {
                    setProfile({
                        name:
                            storedUser.name || "",
                        email:
                            storedUser.email || "",
                        phone:
                            storedUser.phone || "",
                        address:
                            storedUser.address || ""
                    });
                }
            } catch (storageError) {
                console.error(storageError);
            }

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INPUT HANDLERS
    // =====================================================

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswords((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const response = await axios.put(
                `${API}/auth/settings`,
                {
                    name: profile.name,
                    phone: profile.phone,
                    address: profile.address
                },
                config
            );

            const updatedUser =
                response.data?.user;

            if (updatedUser) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );
            } else {
                const storedUser =
                    JSON.parse(
                        localStorage.getItem("user")
                    ) || {};

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...storedUser,
                        name: profile.name,
                        phone: profile.phone,
                        address: profile.address
                    })
                );
            }

            alert("Settings updated successfully.");

        } catch (error) {
            console.error(
                "Failed to update settings:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update settings"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {
            alert("Please fill all password fields.");
            return;
        }

        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {
            alert(
                "New password and confirm password do not match."
            );
            return;
        }

        if (passwords.newPassword.length < 6) {
            alert(
                "New password must be at least 6 characters."
            );
            return;
        }

        try {
            setChangingPassword(true);

            await axios.put(
                `${API}/auth/change-password`,
                {
                    currentPassword:
                        passwords.currentPassword,

                    newPassword:
                        passwords.newPassword
                },
                config
            );

            alert(
                "Password changed successfully."
            );

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {
            console.error(
                "Failed to change password:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setChangingPassword(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="dashboard-layout">

                <ScoutSidebar />

                <main className="dashboard-content">

                    <div className="dashboard-section">
                        <p>
                            Loading settings...
                        </p>
                    </div>

                </main>

            </div>
        );
    }

    return (
        <div className="dashboard-layout">

            <ScoutSidebar />

            <main className="dashboard-content">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="dashboard-header">

                    <div>
                        <h1>Settings</h1>

                        <p>
                            Manage your Scout account
                            settings.
                        </p>
                    </div>

                </div>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div className="dashboard-section">

                    <div className="section-header">

                        <h2>
                            <FiSettings />
                            Account Information
                        </h2>

                    </div>


                    <form
                        className="profile-form"
                        onSubmit={handleSaveProfile}
                    >

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    <FiUser />
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="Your name"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    <FiMail />
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    <FiPhone />
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="Phone number"
                                />

                            </div>


                            <div className="form-group full-width">

                                <label>
                                    <FiMapPin />
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="Address"
                                />

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="back-btn"
                                onClick={() =>
                                    navigate(
                                        "/scout/dashboard"
                                    )
                                }
                            >
                                <FiArrowLeft />
                                Back
                            </button>

                            <button
                                type="submit"
                                className="form-submit-btn"
                                disabled={saving}
                            >
                                <FiSave />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>


                {/* =================================================
                    CHANGE PASSWORD
                ================================================= */}

                <div className="dashboard-section">

                    <div className="section-header">

                        <h2>
                            <FiLock />
                            Change Password
                        </h2>

                    </div>


                    <form
                        className="profile-form"
                        onSubmit={
                            handleChangePassword
                        }
                    >

                        <div className="form-grid">

                            <div className="form-group full-width">

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={
                                        passwords.currentPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="Current password"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={
                                        passwords.newPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="New password"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        passwords.confirmPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="Confirm password"
                                />

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="submit"
                                className="form-submit-btn"
                                disabled={
                                    changingPassword
                                }
                            >
                                <FiLock />

                                {changingPassword
                                    ? "Changing..."
                                    : "Change Password"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
};

export default ScoutSettings;