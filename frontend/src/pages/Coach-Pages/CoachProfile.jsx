import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCamera, FiUser } from "react-icons/fi";
import CoachSidebar from "../../components/CoachSidebar";

const CoachProfile = () => {
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    city: "",
    state: "",
    country: "India",
    sport: "",
    specialization: "",
    experience: 0,
    organization: "",
    achievements: "",
    skills: "",
    bio: "",
    isAvailable: true
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

      const response = await axios.get(
        "http://localhost:5000/api/coaches/get-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const coach = response.data.coach;

      if (coach) {
        fillProfileData(coach);
      } else {
        setError("Coach profile not found.");
      }
    } catch (error) {
      console.error(
        "Load coach profile error:",
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
        "Failed to load coach profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const fillProfileData = (coach) => {
    const profile =
      coach.coachProfile || coach;

    const address =
      profile.address || coach.address || {};

    setProfilePic(
      coach.profilePic ||
      profile.profilePic ||
      ""
    );

    setFormData({
      phone:
        profile.phone ||
        coach.phone ||
        "",

      city:
        address.city ||
        profile.city ||
        coach.city ||
        "",

      state:
        address.state ||
        profile.state ||
        coach.state ||
        "",

      country:
        address.country ||
        profile.country ||
        coach.country ||
        "India",

      sport:
        profile.sport ||
        coach.sport ||
        "",

      specialization:
        profile.specialization ||
        coach.specialization ||
        "",

      experience:
        profile.experience ??
        coach.experience ??
        0,

      organization:
        profile.organization ||
        coach.organization ||
        "",

      achievements:
        Array.isArray(profile.achievements)
          ? profile.achievements
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item?.title || ""
              )
              .filter(Boolean)
              .join(", ")
          : Array.isArray(coach.achievements)
          ? coach.achievements
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item?.title || ""
              )
              .filter(Boolean)
              .join(", ")
          : "",

      skills:
        Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : Array.isArray(coach.skills)
          ? coach.skills.join(", ")
          : "",

      bio:
        profile.bio ||
        coach.bio ||
        "",

      isAvailable:
        profile.isAvailable !== undefined
          ? profile.isAvailable
          : coach.isAvailable !== undefined
          ? coach.isAvailable
          : true
    });
  };

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

  const handlePhotoClick = () => {
    document
      .getElementById(
        "coach-profile-photo-input"
      )
      ?.click();
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
      setError(
        "Image size must be less than 5MB."
      );
      e.target.value = "";
      return;
    }

    const imageData = new FormData();
    imageData.append("profilePic", file);

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

      const response = await axios.post(
        "http://localhost:5000/api/users/profile-pic",
        imageData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newProfilePic =
        response.data.profilePic;

      setProfilePic(newProfilePic);

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const user =
          JSON.parse(storedUser);

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
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/auth", {
          replace: true
        });
        return;
      }

      const data = {
        phone:
          formData.phone.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        country:
          formData.country.trim() ||
          "India",

        sport:
          formData.sport.trim(),

        specialization:
          formData.specialization.trim(),

        experience:
          formData.experience !== ""
            ? Number(formData.experience)
            : 0,

        organization:
          formData.organization.trim(),

        achievements:
          formData.achievements
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        skills:
          formData.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        bio:
          formData.bio.trim(),

        isAvailable:
          formData.isAvailable
      };

      if (!data.sport) {
        setError("Sport is required.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/coaches/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data?.coach) {
        fillProfileData(
          response.data.coach
        );

        const updatedCoach =
          response.data.coach;

        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user =
              JSON.parse(storedUser);

            localStorage.setItem(
              "user",
              JSON.stringify({
                ...user,
                name:
                  updatedCoach.name ||
                  user.name,
                profilePic:
                  updatedCoach.profilePic ||
                  user.profilePic ||
                  ""
              })
            );
          } catch (error) {
            console.error(
              "Failed to update local user:",
              error
            );
          }
        }
      }

      setSuccessMessage(
        "Coach profile updated successfully!"
      );

      setTimeout(() => {
        navigate("/coach/dashboard", {
          replace: true
        });
      }, 1500);
    } catch (error) {
      console.error(
        "Coach profile update error:",
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
        "Failed to update coach profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="athlete-layout">
        <CoachSidebar />

        <main className="athlete-profile-page">
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h1>Loading Profile...</h1>

              <p>
                Please wait while we load your
                profile details.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="athlete-layout">
      <CoachSidebar />

      <main className="athlete-profile-page">
        <div className="profile-form-container">
          <div className="profile-form-header">
            <h1>Edit Coach Profile</h1>

            <p>
              Update your details and keep your
              Athlyx coach profile up to date.
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
                  : "Add a professional photo for your coach profile."}
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
                id="coach-profile-photo-input"
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
              <h2>Coaching Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Sport</label>

                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
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
                  <label>Specialization</label>

                  <input
                    type="text"
                    name="specialization"
                    value={
                      formData.specialization
                    }
                    onChange={handleChange}
                    placeholder="e.g. Batting Coach"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />
              </div>

              <div className="form-group">
                <label>Organization</label>

                <input
                  type="text"
                  name="organization"
                  value={
                    formData.organization
                  }
                  onChange={handleChange}
                  placeholder="Enter organization or academy"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Skills</h2>

              <div className="form-group">
                <label>Coaching Skills</label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Batting, Bowling, Fitness"
                />

                <small>
                  Separate multiple skills
                  with commas.
                </small>
              </div>
            </div>

            <div className="form-section">
              <h2>Achievements</h2>

              <div className="form-group">
                <label>Achievements</label>

                <input
                  type="text"
                  name="achievements"
                  value={
                    formData.achievements
                  }
                  onChange={handleChange}
                  placeholder="State Coach, National Camp"
                />

                <small>
                  Separate multiple achievements
                  with commas.
                </small>
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
                  placeholder="Tell athletes about your coaching experience..."
                />
              </div>
            </div>

            <div className="availability">
              <label>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={
                    formData.isAvailable
                  }
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
                ? "Updating..."
                : "Update Coach Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CoachProfile;