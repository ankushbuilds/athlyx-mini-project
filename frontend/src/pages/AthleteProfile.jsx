import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AthleteProfile = () => {
  const navigate = useNavigate();

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

  const [achievements, setAchievements] = useState([
    {
      title: "",
      description: "",
      year: ""
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleAchievementChange = (index, e) => {
    const updatedAchievements = [...achievements];

    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [e.target.name]: e.target.value
    };

    setAchievements(updatedAchievements);
  };

  const addAchievement = () => {
    setAchievements([
      ...achievements,
      {
        title: "",
        description: "",
        year: ""
      }
    ]);
  };

  const removeAchievement = (index) => {
    setAchievements(
      achievements.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const data = {
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone,
        address: {
          city: formData.city,
          state: formData.state,
          country: formData.country
        },
        sport: formData.sport,
        position: formData.position,
        experience: Number(formData.experience),
        achievements: achievements.filter(
          (achievement) =>
            achievement.title ||
            achievement.description ||
            achievement.year
        ),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        bio: formData.bio,
        height: formData.height
          ? Number(formData.height)
          : undefined,
        weight: formData.weight
          ? Number(formData.weight)
          : undefined,
        socialLinks: {
          instagram: formData.instagram,
          facebook: formData.facebook,
          youtube: formData.youtube
        },
        isAvailable: formData.isAvailable
      };

      await axios.post(
        "http://localhost:5000/api/athletes/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/athlete/dashboard", {
        replace: true
      });
    } catch (error) {
      console.error("Profile creation error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to create athlete profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="athlete-profile-page">
      <div className="profile-form-container">

        <div className="profile-form-header">
          <h1>Complete Your Profile</h1>
          <p>
            Add your details to create your Athlyx athlete profile.
          </p>
        </div>

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

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

            {achievements.map((achievement, index) => (
              <div
                className="achievement-form"
                key={index}
              >
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={achievement.title}
                    onChange={(e) =>
                      handleAchievementChange(index, e)
                    }
                    placeholder="Achievement title"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={achievement.description}
                    onChange={(e) =>
                      handleAchievementChange(index, e)
                    }
                    placeholder="Describe your achievement"
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={achievement.year}
                    onChange={(e) =>
                      handleAchievementChange(index, e)
                    }
                    placeholder="2026"
                  />
                </div>

                {achievements.length > 1 && (
                  <button
                    type="button"
                    className="remove-achievement"
                    onClick={() =>
                      removeAchievement(index)
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="add-achievement"
              onClick={addAchievement}
            >
              + Add Achievement
            </button>
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
            {loading ? "Saving..." : "Complete Profile"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AthleteProfile;