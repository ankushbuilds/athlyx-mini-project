import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiTrash2,
  FiLock,
  FiUser,
  FiLogOut,
  FiEye,
  FiPhone,
  FiBell,
  FiAward,
  FiMail
} from "react-icons/fi";
import AthleteSidebar from "../components/AthleteSidebar";

const Toggle = ({ enabled, setEnabled }) => (
  <button
    type="button"
    className={`settings-toggle ${enabled ? "active" : ""}`}
    onClick={() => setEnabled(!enabled)}
    aria-label="Toggle setting"
  >
    <span></span>
  </button>
);

const Settings = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [contactVisible, setContactVisible] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [opportunityNotifications, setOpportunityNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [emailData, setEmailData] = useState({
    newEmail: "",
    currentPassword: ""
  });

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        "http://localhost:5000/api/auth/delete-account",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(response.data.message || "Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Change password error:", error);
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    const { newEmail, currentPassword } = emailData;
    if (!newEmail || !currentPassword) {
      alert("Please fill all email fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    try {
      setEmailLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/change-email",
        {
          newEmail,
          currentPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.email = newEmail;
      localStorage.setItem("user", JSON.stringify(user));
      alert(response.data.message || "Email changed successfully");
      setEmailData({
        newEmail: "",
        currentPassword: ""
      });
      setShowEmailModal(false);
    } catch (error) {
      console.error("Change email error:", error);
      alert(error.response?.data?.message || "Failed to change email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="settings-page">
       <AthleteSidebar />
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account, privacy and preferences</p>
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
          <button
            type="button"
            onClick={() => navigate("/athlete/profile")}
          >
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
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
          >
            Change
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiMail />
            <div>
              <h3>Change Email Address</h3>
              <p>Update the email address linked to your account</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
          >
            Change
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Privacy</h2>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiEye />
            <div>
              <h3>Profile Visibility</h3>
              <p>Control who can view your athlete profile</p>
            </div>
          </div>

          <select
            className="settings-select"
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiPhone />
            <div>
              <h3>Contact Information</h3>
              <p>Show your contact information on your profile</p>
            </div>
          </div>

          <Toggle
            enabled={contactVisible}
            setEnabled={setContactVisible}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications</h2>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiBell />
            <div>
              <h3>Messages & Requests</h3>
              <p>Get notified about new messages and requests</p>
            </div>
          </div>

          <Toggle
            enabled={messageNotifications}
            setEnabled={setMessageNotifications}
          />
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiAward />
            <div>
              <h3>Opportunity Notifications</h3>
              <p>Receive notifications about athlete opportunities</p>
            </div>
          </div>

          <Toggle
            enabled={opportunityNotifications}
            setEnabled={setOpportunityNotifications}
          />
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <FiMail />
            <div>
              <h3>Email Notifications</h3>
              <p>Receive important updates through email</p>
            </div>
          </div>

          <Toggle
            enabled={emailNotifications}
            setEnabled={setEmailNotifications}
          />
        </div>
      </div>

      <div className="settings-section danger-section">
        <h2>Danger Zone</h2>

        <div className="settings-item delete-item">
          <div className="settings-item-left">
            <FiTrash2 />
            <div>
              <h3>Delete Account</h3>
              <p>Permanently delete your Athlyx account and profile</p>
            </div>
          </div>

          <button
            type="button"
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

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </div>

      {showEmailModal && (
        <div className="email-modal-overlay">
          <div className="email-modal">
            <FiMail className="email-modal-icon" />

            <h2>Change Email Address</h2>
            <p>Enter your new email address and current password.</p>

            <form onSubmit={handleChangeEmail}>
              <div className="email-field">
                <label>New Email Address</label>
                <input
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      newEmail: e.target.value
                    })
                  }
                  placeholder="Enter new email"
                  required
                />
              </div>

              <div className="email-field">
                <label>Current Password</label>
                <input
                  type="password"
                  value={emailData.currentPassword}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      currentPassword: e.target.value
                    })
                  }
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="email-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEmailModal(false)}
                  disabled={emailLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="confirm-email-btn"
                  disabled={emailLoading}
                >
                  {emailLoading ? "Updating..." : "Update Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h2>Change Password</h2>
            <p>Update your password to keep your Athlyx account secure.</p>

            <form onSubmit={handleChangePassword}>
              <div className="password-field">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })
                  }
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="password-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })
                  }
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="password-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })
                  }
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="password-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="confirm-password-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                type="button"
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
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

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <FiLogOut className="logout-modal-icon" />

            <h2>Logout?</h2>
            <p>
              Are you sure you want to sign out of your Athlyx account?
            </p>

            <div className="logout-modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-logout-btn"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;