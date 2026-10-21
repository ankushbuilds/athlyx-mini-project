
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    FiMessageCircle,
    FiSearch,
    FiSend,
    FiArrowLeft,
    FiRefreshCw,
    FiBookmark
} from "react-icons/fi";

import ScoutSidebar from "../../components/ScoutSidebar";
import "../../components/Messages.css";

const API = "http://localhost:5000/api";

const ScoutMessages = () => {
    const [user, setUser] = useState(null);
    const [shortlist, setShortlist] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] =
        useState(null);
    const [messages, setMessages] = useState([]);

    const [search, setSearch] = useState("");
    const [messageText, setMessageText] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const getId = value => {
        if (!value) return "";
        if (typeof value === "object") {
            return String(value._id || value.id || "");
        }
        return String(value);
    };

    const getAuthConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        timeout: 10000
    });

    const getAthleteProfile = item => item?.athlete || null;

    const getAthleteUser = item =>
        getAthleteProfile(item)?.user || null;

    const getAthleteName = item => {
        const athlete = getAthleteProfile(item);
        const athleteUser = getAthleteUser(item);

        return (
            athleteUser?.name ||
            athlete?.name ||
            "Athlete"
        );
    };

    const getOtherParticipant = conversation => {
        if (!conversation || !user) return null;

        const currentUserId = getId(user._id || user.id);

        return conversation.participants?.find(
            participant => getId(participant) !== currentUserId
        ) || null;
    };
const fetchShortlist = useCallback(async () => {
    try {
        const response = await axios.get(
            `${API}/shortlist`,
            getAuthConfig()
        );

        console.log("SHORTLIST API RESPONSE:", response.data);

        const entries = Array.isArray(response.data?.shortlist)
            ? response.data.shortlist
            : [];

        console.log("SHORTLIST ENTRIES:", entries);
        console.log("FIRST ATHLETE:", entries[0]?.athlete);
        console.log("FIRST ATHLETE USER:", entries[0]?.athlete?.user);

        // Temporarily show all returned entries to diagnose filtering.
        setShortlist(entries);
    } catch (err) {
        console.error(
            "SHORTLIST API ERROR:",
            err.response?.status,
            err.response?.data || err.message
        );

        throw err;
    }
}, []);

    const fetchConversations = useCallback(async () => {
        const response = await axios.get(
            `${API}/chat/conversations`,
            getAuthConfig()
        );

        setConversations(
            Array.isArray(response.data?.conversations)
                ? response.data.conversations
                : []
        );
    }, []);

    const refreshData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                fetchShortlist(),
                fetchConversations()
            ]);
        } catch (err) {
            console.error("Scout messages load error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load shortlisted athletes and conversations."
            );
        } finally {
            setLoading(false);
        }
    }, [fetchShortlist, fetchConversations]);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                setError("Please log in again.");
                setLoading(false);
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

         if (parsedUser.role?.toLowerCase() !== "scout") {
                setError("This page is available to scouts only.");
                setLoading(false);
            }
        } catch {
            setError("Invalid user session. Please log in again.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.role === "scout") {
            refreshData();
        }
    }, [user, refreshData]);

    const getConversationForAthlete = athleteUserId =>
        conversations.find(conversation =>
            conversation.participants?.some(
                participant =>
                    getId(participant) === getId(athleteUserId)
            )
        );

    const openConversation = async item => {
        const athleteUser = getAthleteUser(item);
        const athleteUserId = getId(athleteUser);

        if (!athleteUserId) {
            setError("This athlete has no linked user account.");
            return;
        }

        try {
            setError("");
            setLoadingMessages(true);
            setMessages([]);

            // Reuse an existing conversation when possible.
            let conversation =
                getConversationForAthlete(athleteUserId);

            // Otherwise, ask the backend to create one.
            if (!conversation) {
                const response = await axios.post(
                    `${API}/chat/conversation/${athleteUserId}`,
                    {},
                    getAuthConfig()
                );

                conversation = response.data?.conversation;

                if (!conversation?._id) {
                    throw new Error(
                        "The server did not return a conversation."
                    );
                }

                setConversations(previous => {
                    const exists = previous.some(
                        entry => entry._id === conversation._id
                    );

                    return exists
                        ? previous
                        : [conversation, ...previous];
                });
            }

            setSelectedConversation(conversation);

            const response = await axios.get(
                `${API}/chat/${conversation._id}/messages`,
                getAuthConfig()
            );

            setMessages(
                Array.isArray(response.data?.messages)
                    ? response.data.messages
                    : []
            );

            try {
                await axios.put(
                    `${API}/chat/${conversation._id}/read`,
                    {},
                    getAuthConfig()
                );

                setConversations(previous =>
                    previous.map(entry =>
                        entry._id === conversation._id
                            ? {
                                ...entry,
                                unreadCount: 0
                            }
                            : entry
                    )
                );
            } catch (readError) {
                console.warn("Mark as read failed:", readError);
            }
        } catch (err) {
            console.error("Open scout conversation error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Could not open this conversation."
            );
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async () => {
        const text = messageText.trim();

        if (!text || !selectedConversation || sending) return;

        try {
            setSending(true);
            setError("");

            const response = await axios.post(
                `${API}/chat/${selectedConversation._id}/message`,
                { text },
                getAuthConfig()
            );

            const newMessage = response.data?.message;

            if (newMessage) {
                setMessages(previous => [...previous, newMessage]);

                setConversations(previous =>
                    previous.map(conversation =>
                        conversation._id === selectedConversation._id
                            ? {
                                ...conversation,
                                lastMessage: newMessage,
                                lastMessageAt: newMessage.createdAt,
                                unreadCount: 0
                            }
                            : conversation
                    )
                );

                setSelectedConversation(previous =>
                    previous
                        ? {
                            ...previous,
                            lastMessage: newMessage,
                            lastMessageAt: newMessage.createdAt,
                            unreadCount: 0
                        }
                        : null
                );

                setMessageText("");
            }
        } catch (err) {
            console.error("Send scout message error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to send the message."
            );
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const filteredShortlist = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return shortlist;

        return shortlist.filter(item => {
            const athlete = getAthleteProfile(item);
            const athleteUser = getAthleteUser(item);

            const searchable = [
                athleteUser?.name,
                athlete?.sport,
                athlete?.position,
                athlete?.city,
                athlete?.state
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchable.includes(query);
        });
    }, [shortlist, search]);

    const formatTime = date => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const selectedUser = getOtherParticipant(selectedConversation);

    if (!user) {
        return (
            <div className="messages-layout">
                <div className="messages-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="messages-layout">
            <ScoutSidebar />

            <main className="messages-main">
                <div className="messages-container">
                    <div className="messages-header">
                        <div>
                            <h1>Scout Messages</h1>
                            <p>
                                Chat with athletes you have shortlisted.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="shortlist-refresh"
                            onClick={refreshData}
                            disabled={loading}
                            title="Refresh shortlist and conversations"
                        >
                            <FiRefreshCw />
                        </button>
                    </div>

                    {error && (
                        <div className="messages-error">{error}</div>
                    )}

                    <div
                        className={`messages-card ${
                            selectedConversation ? "chat-selected" : ""
                        }`}
                    >
                        <aside className="conversation-panel">
                            <div className="conversation-search">
                                <FiSearch />
                                <input
                                    type="text"
                                    placeholder="Search shortlisted athletes..."
                                    value={search}
                                    onChange={event =>
                                        setSearch(event.target.value)
                                    }
                                />
                            </div>

                            <div className="conversation-list">
                                {loading ? (
                                    <div className="conversation-empty">
                                        <FiMessageCircle />
                                        <p>Loading shortlist...</p>
                                    </div>
                                ) : filteredShortlist.length === 0 ? (
                                    <div className="conversation-empty">
                                        <FiBookmark />
                                        <p>No shortlisted athletes</p>
                                        <span>
                                            Add athletes to your shortlist to
                                            start messaging them.
                                        </span>
                                    </div>
                                ) : (
                                    filteredShortlist.map(item => {
                                        const athlete = getAthleteProfile(item);
                                        const athleteUser = getAthleteUser(item);
                                        const athleteUserId = getId(athleteUser);

                                        const conversation =
                                            getConversationForAthlete(
                                                athleteUserId
                                            );

                                        const isSelected =
                                            conversation?._id ===
                                            selectedConversation?._id;

                                        return (
                                            <button
                                                type="button"
                                                key={item._id || athlete?._id}
                                                className={`conversation-item ${
                                                    isSelected ? "active" : ""
                                                }`}
                                                onClick={() =>
                                                    openConversation(item)
                                                }
                                            >
                                                <div className="conversation-avatar">
                                                    {athleteUser?.profilePic ? (
                                                        <img
                                                            src={athleteUser.profilePic}
                                                            alt={getAthleteName(item)}
                                                        />
                                                    ) : (
                                                        <span>
                                                            {getAthleteName(item)
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="conversation-info">
                                                    <div className="conversation-name">
                                                        {getAthleteName(item)}
                                                    </div>

                                                    <div className="conversation-preview">
                                                        {conversation?.lastMessage?.text ||
                                                            athlete?.sport ||
                                                            "Start a conversation"}
                                                    </div>
                                                </div>

                                                {conversation?.unreadCount > 0 && (
                                                    <span className="unread-badge">
                                                        {conversation.unreadCount}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </aside>

                        <section className="chat-panel">
                            {!selectedConversation ? (
                                <div className="chat-empty">
                                    <div className="chat-empty-icon">
                                        <FiMessageCircle />
                                    </div>
                                    <h2>Select an athlete</h2>
                                    <p>
                                        Choose a shortlisted athlete to open
                                        or start a conversation.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="chat-header">
                                        <button
                                            type="button"
                                            className="mobile-back-btn"
                                            onClick={() => {
                                                setSelectedConversation(null);
                                                setMessages([]);
                                            }}
                                        >
                                            <FiArrowLeft />
                                        </button>

                                        <div className="chat-user-avatar">
                                            {selectedUser?.profilePic ? (
                                                <img
                                                    src={selectedUser.profilePic}
                                                    alt={selectedUser.name || "Athlete"}
                                                />
                                            ) : (
                                                <span>
                                                    {(selectedUser?.name || "A")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="chat-user-info">
                                            <h2>
                                                {selectedUser?.name || "Athlete"}
                                            </h2>
                                            <span>
                                                Shortlisted athlete
                                            </span>
                                        </div>
                                    </div>

                                    <div className="chat-messages">
                                        {loadingMessages ? (
                                            <div className="chat-loading">
                                                Loading messages...
                                            </div>
                                        ) : messages.length === 0 ? (
                                            <div className="chat-no-messages">
                                                <FiMessageCircle />
                                                <p>No messages yet.</p>
                                                <span>
                                                    Send the first message to
                                                    start the conversation.
                                                </span>
                                            </div>
                                        ) : (
                                            messages.map(message => {
                                                const isMine =
                                                    getId(message.sender) ===
                                                    getId(user._id || user.id);

                                                return (
                                                    <div
                                                        key={message._id}
                                                        className={`message-row ${
                                                            isMine
                                                                ? "mine"
                                                                : "received"
                                                        }`}
                                                    >
                                                        <div className="message-bubble">
                                                            <p>{message.text}</p>
                                                            <span>
                                                                {formatTime(
                                                                    message.createdAt
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="message-input-area">
                                        <textarea
                                            value={messageText}
                                            onChange={event =>
                                                setMessageText(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type a message..."
                                            rows="1"
                                            maxLength="2000"
                                            disabled={sending}
                                        />

                                        <button
                                            type="button"
                                            className="send-message-btn"
                                            onClick={handleSendMessage}
                                            disabled={
                                                !messageText.trim() || sending
                                            }
                                        >
                                            <FiSend />
                                            <span>
                                                {sending ? "Sending..." : "Send"}
                                            </span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ScoutMessages;
