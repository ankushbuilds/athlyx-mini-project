import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSend, FiMessageCircle, FiArrowLeft } from "react-icons/fi";
import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyMessages = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const [loadingContacts, setLoadingContacts] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // =========================
    // LOAD CONNECTED USERS
    // =========================
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoadingContacts(true);
                setError("");

                const [athletesResponse, coachesResponse] =
                    await Promise.all([
                        axios.get(
                            `${API}/connections/academy/athletes`,
                            authConfig
                        ),
                        axios.get(
                            `${API}/connections/academy/coaches`,
                            authConfig
                        )
                    ]);

                const athletes =
                    athletesResponse.data?.athletes || [];

                const coaches =
                    coachesResponse.data?.coaches || [];

                const athleteContacts = athletes.map((item) => {
                    const user = item.user || item;

                    return {
                        ...user,
                        connectionType: "athlete",
                        connectionId: item._id
                    };
                });

                const coachContacts = coaches.map((item) => {
                    const user = item.user || item;

                    return {
                        ...user,
                        connectionType: "coach",
                        connectionId: item._id
                    };
                });

                setContacts([
                    ...athleteContacts,
                    ...coachContacts
                ]);
            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load connected users."
                );
            } finally {
                setLoadingContacts(false);
            }
        };

        fetchContacts();
    }, []);

    // =========================
    // LOAD CONVERSATION
    // =========================
    const openConversation = async (user) => {
        try {
            setSelectedUser(user);
            setMessages([]);
            setLoadingMessages(true);
            setError("");

            const response = await axios.get(
                `${API}/chat/conversation/${user._id}`,
                authConfig
            );

            const conversation =
                response.data?.conversation;

            if (conversation?._id) {
                const messagesResponse = await axios.get(
                    `${API}/chat/${conversation._id}/messages`,
                    authConfig
                );

                setMessages(
                    messagesResponse.data?.messages || []
                );
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load conversation."
            );
        } finally {
            setLoadingMessages(false);
        }
    };

    // =========================
    // SEND MESSAGE
    // =========================
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || !selectedUser || sending) {
            return;
        }

        try {
            setSending(true);
            setError("");

            const conversationResponse = await axios.get(
                `${API}/chat/conversation/${selectedUser._id}`,
                authConfig
            );

            const conversation =
                conversationResponse.data?.conversation;

            if (!conversation?._id) {
                throw new Error("Conversation not found.");
            }

            const response = await axios.post(
                `${API}/chat/${conversation._id}/message`,
                {
                    text: message.trim()
                },
                authConfig
            );

            const newMessage =
                response.data?.message;

            if (newMessage) {
                setMessages((prev) => [
                    ...prev,
                    newMessage
                ]);
            }

            setMessage("");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to send message."
            );
        } finally {
            setSending(false);
        }
    };

    // =========================
    // FORMAT MESSAGE TIME
    // =========================
    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="dashboard-layout">

            <AcademySidebar />

            <main className="messages-page">

                <div className="messages-container">

                    {/* =========================
                        CONTACTS SIDEBAR
                    ========================= */}
                    <div
                        className={`messages-contacts ${
                            selectedUser
                                ? "messages-contacts-hidden-mobile"
                                : ""
                        }`}
                    >

                        <div className="messages-header">
                            <div>
                                <p className="page-eyebrow">
                                    ACADEMY
                                </p>

                                <h1>Messages</h1>
                            </div>
                        </div>

                        {loadingContacts && (
                            <div className="messages-empty">
                                Loading contacts...
                            </div>
                        )}

                        {error && !selectedUser && (
                            <div className="messages-error">
                                {error}
                            </div>
                        )}

                        {!loadingContacts &&
                            contacts.length === 0 && (
                                <div className="messages-empty">
                                    <FiMessageCircle size={28} />

                                    <p>
                                        No connected athletes or
                                        coaches yet.
                                    </p>
                                </div>
                            )}

                        <div className="messages-contact-list">

                            {contacts.map((user) => (
                                <button
                                    key={`${user.connectionType}-${user._id}`}
                                    className={`message-contact ${
                                        selectedUser?._id === user._id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        openConversation(user)
                                    }
                                >

                                    <div className="message-contact-avatar">
                                        {user.profilePic ? (
                                            <img
                                                src={user.profilePic}
                                                alt={user.name}
                                            />
                                        ) : (
                                            user.name
                                                ?.charAt(0)
                                                .toUpperCase()
                                        )}
                                    </div>

                                    <div className="message-contact-info">

                                        <strong>
                                            {user.name}
                                        </strong>

                                        <span>
                                            {user.connectionType ===
                                            "athlete"
                                                ? "Athlete"
                                                : "Coach"}
                                        </span>

                                    </div>

                                </button>
                            ))}

                        </div>

                    </div>

                    {/* =========================
                        CHAT WINDOW
                    ========================= */}
                    <div
                        className={`messages-chat ${
                            selectedUser
                                ? "messages-chat-active-mobile"
                                : ""
                        }`}
                    >

                        {!selectedUser ? (

                            <div className="messages-no-chat">

                                <FiMessageCircle size={48} />

                                <h2>
                                    Select a conversation
                                </h2>

                                <p>
                                    Choose a connected athlete or
                                    coach to start chatting.
                                </p>

                            </div>

                        ) : (

                            <>
                                {/* CHAT HEADER */}

                                <div className="messages-chat-header">

                                    <button
                                        className="messages-back-btn"
                                        onClick={() =>
                                            setSelectedUser(null)
                                        }
                                    >
                                        <FiArrowLeft />
                                    </button>

                                    <div className="message-contact-avatar">

                                        {selectedUser.profilePic ? (
                                            <img
                                                src={
                                                    selectedUser.profilePic
                                                }
                                                alt={
                                                    selectedUser.name
                                                }
                                            />
                                        ) : (
                                            selectedUser.name
                                                ?.charAt(0)
                                                .toUpperCase()
                                        )}

                                    </div>

                                    <div>

                                        <h3>
                                            {selectedUser.name}
                                        </h3>

                                        <span>
                                            {selectedUser.connectionType ===
                                            "athlete"
                                                ? "Athlete"
                                                : "Coach"}
                                        </span>

                                    </div>

                                </div>

                                {/* ERROR */}

                                {error && (
                                    <div className="messages-error">
                                        {error}
                                    </div>
                                )}

                                {/* MESSAGES */}

                                <div className="messages-body">

                                    {loadingMessages ? (

                                        <div className="messages-empty">
                                            Loading messages...
                                        </div>

                                    ) : messages.length === 0 ? (

                                        <div className="messages-empty">
                                            <p>
                                                No messages yet.
                                            </p>

                                            <span>
                                                Start the conversation.
                                            </span>
                                        </div>

                                    ) : (

                                        messages.map((item) => {

                                            const currentUserId =
                                                JSON.parse(
                                                    localStorage.getItem(
                                                        "user"
                                                    ) || "null"
                                                )?._id;

                                            const isMine =
                                                item.sender?._id ===
                                                currentUserId ||
                                                item.sender ===
                                                currentUserId;

                                            return (
                                                <div
                                                    key={item._id}
                                                    className={`message-row ${
                                                        isMine
                                                            ? "sent"
                                                            : "received"
                                                    }`}
                                                >

                                                    <div className="message-bubble">

                                                        <p>
                                                            {item.text}
                                                        </p>

                                                        <span>
                                                            {formatTime(
                                                                item.createdAt
                                                            )}
                                                        </span>

                                                    </div>

                                                </div>
                                            );
                                        })

                                    )}

                                </div>

                                {/* MESSAGE INPUT */}

                                <form
                                    className="messages-input-area"
                                    onSubmit={sendMessage}
                                >

                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Write a message..."
                                        maxLength={2000}
                                    />

                                    <button
                                        type="submit"
                                        disabled={
                                            !message.trim() ||
                                            sending
                                        }
                                    >
                                        <FiSend />

                                        <span>
                                            {sending
                                                ? "Sending"
                                                : "Send"}
                                        </span>
                                    </button>

                                </form>

                            </>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AcademyMessages;