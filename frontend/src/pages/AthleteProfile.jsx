import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCamera, FiUser } from "react-icons/fi";

const AthleteProfile = () => {
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
    dateOfBirth: "",
    gender: "",
    phone: "",
    city: "",
    state: "",
    country: "India",
    sport: "",
    position: "",
    experience: 0,
    skills: "",
    bio: "",
    height: "",
    weight: "",
    instagram: "",
    facebook: "",
    youtube: "",
    isAvailable: true
  });

  const [achievement, setAchievement] = useState({
    title: "",
    description: "",
    year: ""
  });

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

      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const user = userResponse.data.user || userResponse.data;

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

      try {
        const response = await axios.get(
          "http://localhost:5000/api/athletes/get-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const athlete = response.data.athlete;

        if (athlete) {
          setIsEditMode(true);
          fillProfileData(athlete);
        }
      } catch (profileError) {
        if (profileError.response?.status === 404) {
          setIsEditMode(false);
        } else if (profileError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/auth", { replace: true });
          return;
        } else {
          throw profileError;
        }
      }
    } catch (error) {
      console.error("Load profile error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth", { replace: true });
        return;
      }

      setError(
        error.response?.data?.message ||
        "Failed to load profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const fillProfileData = (athlete) => {
    setFormData({
      dateOfBirth: athlete.dateOfBirth
        ? new Date(athlete.dateOfBirth)
            .toISOString()
            .split("T")[0]
        : "",
      gender: athlete.gender || "",
      phone: athlete.phone || "",
      city: athlete.address?.city || "",
      state: athlete.address?.state || "",
      country: athlete.address?.country || "India",
      sport: athlete.sport || "",
      position: athlete.position || "",
      experience: athlete.experience ?? 0,
      skills: Array.isArray(athlete.skills)
        ? athlete.skills.join(", ")
        : "",
      bio: athlete.bio || "",
      height: athlete.height ?? "",
      weight: athlete.weight ?? "",
      instagram: athlete.socialLinks?.instagram || "",
      facebook: athlete.socialLinks?.facebook || "",
      youtube: athlete.socialLinks?.youtube || "",
      isAvailable:
        athlete.isAvailable !== undefined
          ? athlete.isAvailable
          : true
    });

    if (
      Array.isArray(athlete.achievements) &&
      athlete.achievements.length > 0
    ) {
      const firstAchievement = athlete.achievements[0];

      setAchievement({
        title: firstAchievement.title || "",
        description: firstAchievement.description || "",
        year: firstAchievement.year || ""
      });
    } else {
      setAchievement({
        title: "",
        description: "",
        year: ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAchievementChange = (e) => {
    const { name, value } = e.target;

    setAchievement((prev) => ({
      ...prev,
      [name]: value
    }));
  };

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
        "http://localhost:5000/api/users/profile-pic",
        imageData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newProfilePic = response.data.profilePic;

      setProfilePic(newProfilePic);

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            profilePic: newProfilePic
          })
        );
      }

      setSuccessMessage(
        "Profile photo uploaded successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Profile picture upload error:",
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
        setLoading(false);
        return;
      }

      const data = {
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        phone: formData.phone || undefined,
        address: {
          city: formData.city || "",
          state: formData.state || "",
          country: formData.country || "India"
        },
        sport: formData.sport.trim(),
        position: formData.position || undefined,
        experience:
          formData.experience !== ""
            ? Number(formData.experience)
            : 0,
        achievements:
          achievement.title ||
          achievement.description ||
          achievement.year
            ? [
                {
                  title: achievement.title,
                  description: achievement.description,
                  year: achievement.year
                    ? Number(achievement.year)
                    : undefined
                }
              ]
            : [],
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        bio: formData.bio || undefined,
        height:
          formData.height !== ""
            ? Number(formData.height)
            : undefined,
        weight:
          formData.weight !== ""
            ? Number(formData.weight)
            : undefined,
        socialLinks: {
          instagram: formData.instagram || "",
          facebook: formData.facebook || "",
          youtube: formData.youtube || ""
        },
        isAvailable: formData.isAvailable
      };

      let response;

      if (isEditMode) {
        response = await axios.put(
          "http://localhost:5000/api/athletes/update-profile",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setSuccessMessage(
          "Athlete profile updated successfully!"
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/athletes/create",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setIsEditMode(true);

        setSuccessMessage(
          "Athlete profile created successfully!"
        );
      }

      if (response.data?.athlete) {
        fillProfileData(response.data.athlete);
      }

      setTimeout(() => {
        navigate("/athlete/dashboard", {
          replace: true
        });
      }, 1500);
    } catch (error) {
      console.error(
        isEditMode
          ? "Profile update error:"
          : "Profile creation error:",
        error
      );

      if (
        error.response?.status === 400 &&
        error.response?.data?.message ===
          "Athlete profile already exists"
      ) {
        setError(
          "Your athlete profile already exists. Reloading your profile..."
        );

        setTimeout(() => {
          loadProfile();
        }, 1000);

        return;
      }

      setError(
        error.response?.data?.message ||
        (isEditMode
          ? "Failed to update athlete profile."
          : "Failed to create athlete profile.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="athlete-profile-page">
        <div className="profile-form-container">
          <div className="profile-form-header">
            <h1>Loading Profile...</h1>
            <p>
              Please wait while we load your profile details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="athlete-profile-page">
      <div className="profile-form-container">
        <div className="profile-form-header">
          <h1>
            {isEditMode
              ? "Edit Athlete Profile"
              : "Complete Your Profile"}
          </h1>
          <p>
            {isEditMode
              ? "Update your details and keep your Athlyx profile up to date."
              : "Add your details to create your Athlyx athlete profile."}
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
                : "Add a professional photo for your athlete profile."}
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
          <div className="form-section">
            <h2>Personal Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

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
          </div>

          <div className="form-section">
            <h2>Location</h2>
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

          <div className="form-section">
            <h2>Sports Information</h2>
            <div className="form-row">
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

              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Batsman, Forward"
                />
              </div>
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

          <div className="form-section">
            <h2>Physical Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  min="0"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 175"
                />
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 65"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Skills</h2>
            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Batting, Bowling, Speed"
              />
              <small>
                Separate multiple skills with commas.
              </small>
            </div>
          </div>

          <div className="form-section">
            <h2>Achievements</h2>
            <div className="achievement-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={achievement.title}
                  onChange={handleAchievementChange}
                  placeholder="Achievement title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={achievement.description}
                  onChange={handleAchievementChange}
                  placeholder="Describe your achievement"
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={achievement.year}
                  onChange={handleAchievementChange}
                  placeholder="2026"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>About You</h2>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                maxLength="500"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell coaches and scouts about yourself..."
              />
            </div>
          </div>

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
              <label>Facebook</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Facebook profile URL"
              />
            </div>

            <div className="form-group">
              <label>YouTube</label>
              <input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="YouTube channel URL"
              />
            </div>
          </div>

          <div className="availability">
            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Available for opportunities
            </label>
          </div>

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
    </div>
  );
};

export default AthleteProfile;