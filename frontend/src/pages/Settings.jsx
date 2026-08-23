import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiLock, FiUser, FiLogOut } from "react-icons/fi";

const Settings = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:5000/api/auth/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/auth");
    } catch (error) {
      console.error("Delete account error:", error);
      alert(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-section">
        <h2>Account</h2>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiUser />
            <div>
              <h3>Profile</h3>
              <p>Manage your personal and athlete information</p>
            </div>
          </div>

          <button onClick={() => navigate("/profile")}>
            Manage
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiLock />
            <div>
              <h3>Change Password</h3>
              <p>Update your account password</p>
            </div>
          </div>

          <button>
            Change
          </button>
        </div>
      </div>

      <div className="settings-section danger-section">
        <h2>Danger Zone</h2>

        <div className="settings-item delete-item">
          <div className="settings-item-left">
            <FiTrash2 />
            <div>
              <h3>Delete Account</h3>
              <p>
                Permanently delete your Athlyx account and profile
              </p>
            </div>
          </div>

          <button
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Session</h2>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiLogOut />
            <div>
              <h3>Logout</h3>
              <p>Sign out from your Athlyx account</p>
            </div>
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <FiTrash2 className="delete-modal-icon" />

            <h2>Delete Account?</h2>

            <p>
              Are you sure you want to permanently delete your account?
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;