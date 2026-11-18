
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiCamera,
  FiUser
} from "react-icons/fi";

import ScoutSidebar from "../../components/ScoutSidebar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ScoutProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profilePic, setProfilePic] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    organization: "",
    sport: "",
    specialization: "",
    experience: 0,
    phone: "",
    city: "",
    state: "",
    country: "India",
    skills: "",
    bio: "",
    instagram: "",
    linkedin: "",
    website: "",
    isAvailable: true
  });

  // =====================================================
  // SYNC SCOUT PROFILE WITH LOCAL STORAGE
  // =====================================================

  const syncScoutToLocalStorage = (scout) => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        sport: scout.sport || "",
        specialization: scout.specialization || "",
        organization: scout.organization || "",
        experience: scout.experience ?? 0,
        phone: scout.phone || "",
        scoutProfile: scout
      })
    );
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth", { replace: true });
      return;
    }

    try {
      setLoadingProfile(true);
      setError("");

      // Load user for profile picture
      const userResponse = await axios.get(
        `${API}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const user =
        userResponse.data.user ||
        userResponse.data;

      if (user) {
        setProfilePic(user.profilePic || "");

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            profilePic: user.profilePic || ""
          })
        );
      }

      // Load scout profile
      try {
        const response = await axios.get(
          `${API}/scouts/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const scout = response.data?.scout;

        if (scout) {
          setIsEditMode(true);
          fillProfileData(scout);
          syncScoutToLocalStorage(scout);
        }
      } catch (profileError) {
        if (profileError.response?.status === 404) {
          setIsEditMode(false);
        } else if (profileError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/auth", {
            replace: true
          });

          return;
        } else {
          throw profileError;
        }
      }
    } catch (error) {
      console.error(
        "Load scout profile error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", {
          replace: true
        });

        return;
      }

      setError(
        error.response?.data?.message ||
        "Failed to load scout profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // =====================================================
  // FILL PROFILE DATA
  // =====================================================

  const fillProfileData = (scout) => {
    setFormData({
      organization: scout.organization || "",
      sport: (scout.sport || "").toLowerCase().trim(),
      specialization: scout.specialization || "",
      experience: scout.experience ?? 0,
      phone: scout.phone || "",

      city: scout.address?.city || "",
      state: scout.address?.state || "",
      country: scout.address?.country || "India",

      skills: scout.skills || "",
      bio: scout.bio || "",

      instagram: scout.socialLinks?.instagram || "",
      linkedin: scout.socialLinks?.linkedin || "",
      website: scout.socialLinks?.website || "",

      isAvailable:
        scout.isAvailable !== undefined
          ? scout.isAvailable
          : true
    });
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // =====================================================
  // PROFILE PHOTO
  // =====================================================

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    const imageData = new FormData();
    imageData.append("profilePic", file);

    try {
      setUploadingPhoto(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API}/users/profile-pic`,
        imageData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newProfilePic = response.data.profilePic;

      setProfilePic(newProfilePic);

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          profilePic: newProfilePic
        })
      );

      setSuccessMessage(
        "Profile photo uploaded successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Scout profile picture upload error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to upload profile picture."
      );
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      if (!formData.sport.trim()) {
        setError("Sport is required.");
        return;
      }

      const data = {
        organization: formData.organization.trim(),
        sport: formData.sport.trim().toLowerCase(),
        specialization: formData.specialization.trim(),

        experience:
          formData.experience !== ""
            ? Number(formData.experience)
            : 0,

        phone: formData.phone.trim(),

        address: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim() || "India"
        },

        skills: formData.skills.trim(),
        bio: formData.bio.trim(),

        socialLinks: {
          instagram: formData.instagram.trim(),
          linkedin: formData.linkedin.trim(),
          website: formData.website.trim()
        },

        isAvailable: formData.isAvailable
      };

      const response = await axios.post(
        `${API}/scouts/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const savedScout = response.data?.scout;

      if (savedScout) {
        fillProfileData(savedScout);
        syncScoutToLocalStorage(savedScout);
      } else {
        // Fallback if the API does not return the saved Scout object
        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            sport: data.sport,
            specialization: data.specialization,
            organization: data.organization
          })
        );
      }

      const wasEditMode = isEditMode;
      setIsEditMode(true);

      setSuccessMessage(
        wasEditMode
          ? "Scout profile updated successfully!"
          : "Scout profile created successfully!"
      );

      setTimeout(() => {
        navigate("/scout/dashboard", {
          replace: true
        });
      }, 1500);
    } catch (error) {
      console.error(
        "Scout profile save error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to save scout profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingProfile) {
    return (
      <div className="athlete-layout">
        <ScoutSidebar />

        <main className="athlete-profile-page">
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h1>Loading Profile...</h1>

              <p>
                Please wait while we load your profile details.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="athlete-layout">
      <ScoutSidebar />

      <main className="athlete-profile-page">
        <div className="profile-form-container">

          <div className="profile-form-header">
            <h1>
              {isEditMode
                ? "Edit Scout Profile"
                : "Complete Your Scout Profile"}
            </h1>

            <p>
              {isEditMode
                ? "Update your scouting profile."
                : "Add your professional scouting details."}
            </p>
          </div>

          {successMessage && (
            <div className="profile-success">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* PROFILE PHOTO */}

          <div className="profile-photo-section">
            <div className="profile-photo-wrapper">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <div className="profile-photo-placeholder">
                  <FiUser />
                </div>
              )}

              <button
                type="button"
                className="profile-photo-button"
                onClick={handlePhotoClick}
                disabled={uploadingPhoto}
              >
                <FiCamera />
              </button>
            </div>

            <div className="profile-photo-info">
              <h2>Profile Photo</h2>

              <p>
                {uploadingPhoto
                  ? "Uploading photo..."
                  : "Add a professional photo for your scout profile."}
              </p>

              <button
                type="button"
                className="change-photo-btn"
                onClick={handlePhotoClick}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto
                  ? "Uploading..."
                  : profilePic
                    ? "Change Photo"
                    : "Upload Photo"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* PROFESSIONAL DETAILS */}

            <div className="form-section">
              <h2>Professional Details</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Organization</label>

                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Organization / Club"
                  />
                </div>

                <div className="form-group">
                  <label>Sport</label>

                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Sport</option>
                    <option value="cricket">Cricket</option>
                    <option value="football">Football</option>
                    <option value="hockey">Hockey</option>
                    <option value="basketball">Basketball</option>
                    <option value="athletics">Athletics</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Specialization</label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Talent Identification"
                  />
                </div>

                <div className="form-group">
                  <label>Experience (Years)</label>

                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* CONTACT & LOCATION */}

            <div className="form-section">
              <h2>Contact & Location</h2>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-group">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Country</label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* SCOUTING DETAILS */}

            <div className="form-section">
              <h2>Scouting Details</h2>

              <div className="form-group">
                <label>Scouting Skills</label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Talent identification, player analysis, scouting"
                />

                <small>
                  Separate multiple skills with commas.
                </small>
              </div>
            </div>

            {/* BIO */}

            <div className="form-section">
              <h2>About You</h2>

              <div className="form-group">
                <label>Bio</label>

                <textarea
                  name="bio"
                  maxLength="2000"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell athletes about yourself..."
                />
              </div>
            </div>

            {/* SOCIAL LINKS */}

            <div className="form-section">
              <h2>Social Links</h2>

              <div className="form-group">
                <label>Instagram</label>

                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="Instagram profile URL"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn</label>

                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn profile URL"
                />
              </div>

              <div className="form-group">
                <label>Website</label>

                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Website URL"
                />
              </div>
            </div>

            {/* AVAILABILITY */}

            <div className="availability">
              <label>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />

                Available for scouting
              </label>
            </div>

            {/* SAVE */}

            <button
              type="submit"
              className="save-profile-btn"
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Profile"
                  : "Complete Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ScoutProfile;
